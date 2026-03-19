# whoop-mcp

An MCP (Model Context Protocol) server for the [Whoop API](https://developer.whoop.com). Connects your Whoop health data — recovery, sleep, workouts, cycles, and profile — to any MCP-compatible AI tool.

## Prerequisites

- Node.js 18+
- A [Whoop Developer account](https://developer.whoop.com) with an OAuth app

## Setup

### 1. Create a Whoop OAuth App

1. Go to [developer.whoop.com](https://developer.whoop.com) and create an account
2. Create a new application
3. Add `http://localhost:3000/callback` as a redirect URI
4. Copy your **Client ID** and **Client Secret**

### 2. Install dependencies

```bash
npm install
```

### 3. Configure your AI tool

The MCP server command is the same regardless of which tool you use:

```
command: node
args:
  - --import
  - /absolute/path/to/whoop-mcp/node_modules/tsx/dist/esm/index.cjs
  - /absolute/path/to/whoop-mcp/src/index.ts
env:
  WHOOP_CLIENT_ID: your_client_id_here
  WHOOP_CLIENT_SECRET: your_client_secret_here
```

Replace `/absolute/path/to/whoop-mcp` with the actual path where you saved this project.

#### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "whoop": {
      "command": "node",
      "args": [
        "--import", "/absolute/path/to/whoop-mcp/node_modules/tsx/dist/esm/index.cjs",
        "/absolute/path/to/whoop-mcp/src/index.ts"
      ],
      "env": {
        "WHOOP_CLIENT_ID": "your_client_id_here",
        "WHOOP_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

#### Cursor

Edit `.cursor/mcp.json` in your project root (or `~/.cursor/mcp.json` globally):

```json
{
  "mcpServers": {
    "whoop": {
      "command": "node",
      "args": [
        "--import", "/absolute/path/to/whoop-mcp/node_modules/tsx/dist/esm/index.cjs",
        "/absolute/path/to/whoop-mcp/src/index.ts"
      ],
      "env": {
        "WHOOP_CLIENT_ID": "your_client_id_here",
        "WHOOP_CLIENT_SECRET": "your_client_secret_here"
      }
    }
  }
}
```

#### ChatGPT Desktop

ChatGPT Desktop supports MCP servers. Add the server via **Settings → Tools → MCP Servers**, using the same command and args above.

#### Other MCP-compatible tools

This server works with any tool that supports the MCP stdio transport: **Windsurf**, **Zed**, **Cline**, **Continue**, and others. Refer to your tool's documentation for where to add MCP server configuration — the command and args are identical across all of them.

### 4. Authorize

On first use, the server will:
1. Open your browser to the Whoop authorization page
2. Ask you to log in and grant access
3. Save tokens to `~/.config/whoop-mcp/tokens.json`

Tokens are automatically refreshed — you only need to authorize once.

## Available Tools

| Tool | Description |
|------|-------------|
| `get_profile` | Your Whoop user profile (name, email) |
| `get_body_measurements` | Height, weight, max heart rate |
| `get_cycles` | Physiological cycles with strain scores |
| `get_cycle` | Single cycle by ID |
| `get_recovery_collection` | Recovery scores with HRV, RHR, SpO2 |
| `get_recovery` | Single recovery by ID |
| `get_sleep_collection` | Sleep activities with stage breakdown |
| `get_sleep` | Single sleep activity by ID |
| `get_workout_collection` | Workouts with strain and heart rate zones |
| `get_workout` | Single workout by ID |

Collection tools accept optional `limit`, `start`, `end` (ISO 8601), and `nextToken` parameters for filtering and pagination.

## Example prompts

- *"What was my recovery score this week?"*
- *"How did I sleep last night?"*
- *"Show me my last 5 workouts"*
- *"What's my average HRV over the past month?"*
