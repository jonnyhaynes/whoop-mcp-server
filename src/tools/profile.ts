import { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getProfile, getBodyMeasurements } from "../client.js";

export const profileTools: Tool[] = [
  {
    name: "get_profile",
    description: "Get the authenticated Whoop user's profile (name, email, user ID)",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "get_body_measurements",
    description: "Get the authenticated Whoop user's body measurements (height, weight, max heart rate)",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

export async function handleProfileTool(name: string): Promise<CallToolResult | null> {
  if (name === "get_profile") {
    const profile = await getProfile();
    return {
      content: [{ type: "text", text: JSON.stringify(profile, null, 2) }],
    };
  }

  if (name === "get_body_measurements") {
    const measurements = await getBodyMeasurements();
    return {
      content: [{ type: "text", text: JSON.stringify(measurements, null, 2) }],
    };
  }

  return null;
}
