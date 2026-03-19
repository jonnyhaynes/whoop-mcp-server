import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import * as os from "os";
import { createHash, randomBytes } from "crypto";

const TOKEN_FILE = path.join(os.homedir(), ".config", "whoop-mcp", "tokens.json");
const AUTH_URL = "https://api.prod.whoop.com/oauth/oauth2/auth";
const TOKEN_URL = "https://api.prod.whoop.com/oauth/oauth2/token";
const REDIRECT_URI = "http://localhost:3000/callback";
const SCOPES = "read:recovery read:cycles read:workout read:sleep read:profile read:body_measurement offline";
const REFRESH_BUFFER_SECS = 300; // refresh 5 minutes before expiry

interface TokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix timestamp in seconds
}

function getClientCredentials(): { clientId: string; clientSecret: string } {
  const clientId = process.env.WHOOP_CLIENT_ID;
  const clientSecret = process.env.WHOOP_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("WHOOP_CLIENT_ID and WHOOP_CLIENT_SECRET environment variables are required");
  }
  return { clientId, clientSecret };
}

function loadTokens(): TokenData | null {
  try {
    const data = fs.readFileSync(TOKEN_FILE, "utf-8");
    return JSON.parse(data) as TokenData;
  } catch {
    return null;
  }
}

function saveTokens(tokens: TokenData): void {
  const dir = path.dirname(TOKEN_FILE);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokens, null, 2), { mode: 0o600 });
}

function isExpiringSoon(tokens: TokenData): boolean {
  return Date.now() / 1000 > tokens.expires_at - REFRESH_BUFFER_SECS;
}

async function exchangeCode(code: string, clientId: string, clientSecret: string): Promise<TokenData> {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    redirect_uri: REDIRECT_URI,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }

  const json = await res.json() as {
    access_token: string;
    refresh_token: string;
    expires_in: number;
  };

  return {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + json.expires_in,
  };
}

async function refreshAccessToken(tokens: TokenData, clientId: string, clientSecret: string): Promise<TokenData> {
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: tokens.refresh_token,
    client_id: clientId,
    client_secret: clientSecret,
  });

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token refresh failed: ${res.status} ${text}`);
  }

  const json = await res.json() as {
    access_token: string;
    refresh_token?: string;
    expires_in: number;
  };

  return {
    access_token: json.access_token,
    refresh_token: json.refresh_token ?? tokens.refresh_token,
    expires_at: Math.floor(Date.now() / 1000) + json.expires_in,
  };
}

async function runOAuthFlow(clientId: string): Promise<string> {
  const state = randomBytes(16).toString("hex");

  const authUrl = new URL(AUTH_URL);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", REDIRECT_URI);
  authUrl.searchParams.set("scope", SCOPES);
  authUrl.searchParams.set("state", state);

  const url = authUrl.toString();
  console.error("\n=== Whoop Authentication Required ===");
  console.error("Open this URL in your browser to authorize:\n");
  console.error(url);
  console.error("\nWaiting for authorization...\n");

  // Try to open the browser automatically
  try {
    const { default: open } = await import("open");
    await open(url);
  } catch {
    // Browser open failed — user will use the printed URL
  }

  // Start local callback server
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      const reqUrl = new URL(req.url ?? "/", "http://localhost:3000");
      if (reqUrl.pathname !== "/callback") {
        res.writeHead(404);
        res.end();
        return;
      }

      const code = reqUrl.searchParams.get("code");
      const returnedState = reqUrl.searchParams.get("state");
      const error = reqUrl.searchParams.get("error");

      if (error) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<html><body><h2>Authorization failed: ${error}</h2><p>You can close this tab.</p></body></html>`);
        server.close();
        reject(new Error(`OAuth error: ${error}`));
        return;
      }

      if (!code || returnedState !== state) {
        res.writeHead(400, { "Content-Type": "text/html" });
        res.end(`<html><body><h2>Invalid callback</h2><p>You can close this tab.</p></body></html>`);
        server.close();
        reject(new Error("Invalid OAuth callback: missing code or state mismatch"));
        return;
      }

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(`<html><body><h2>Authorization successful!</h2><p>You can close this tab and return to your application.</p></body></html>`);
      server.close();
      resolve(code);
    });

    server.listen(3000, "localhost", () => {});
    server.on("error", reject);
  });
}

export async function getAccessToken(): Promise<string> {
  const { clientId, clientSecret } = getClientCredentials();

  let tokens = loadTokens();

  if (tokens && !isExpiringSoon(tokens)) {
    return tokens.access_token;
  }

  if (tokens && isExpiringSoon(tokens)) {
    try {
      tokens = await refreshAccessToken(tokens, clientId, clientSecret);
      saveTokens(tokens);
      return tokens.access_token;
    } catch {
      // refresh failed — fall through to full OAuth flow
    }
  }

  // Full OAuth flow
  const code = await runOAuthFlow(clientId);
  tokens = await exchangeCode(code, clientId, clientSecret);
  saveTokens(tokens);
  console.error("Authorization successful. Tokens saved.\n");
  return tokens.access_token;
}
