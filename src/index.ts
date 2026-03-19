#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { profileTools, handleProfileTool } from "./tools/profile.js";
import { cycleTools, handleCycleTool } from "./tools/cycles.js";
import { recoveryTools, handleRecoveryTool } from "./tools/recovery.js";
import { sleepTools, handleSleepTool } from "./tools/sleep.js";
import { workoutTools, handleWorkoutTool } from "./tools/workouts.js";

const ALL_TOOLS = [
  ...profileTools,
  ...cycleTools,
  ...recoveryTools,
  ...sleepTools,
  ...workoutTools,
];

const server = new Server(
  { name: "whoop-mcp", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: ALL_TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  try {
    const result =
      (await handleProfileTool(name)) ??
      (await handleCycleTool(name, args)) ??
      (await handleRecoveryTool(name, args)) ??
      (await handleSleepTool(name, args)) ??
      (await handleWorkoutTool(name, args));

    if (!result) {
      return {
        content: [{ type: "text", text: `Unknown tool: ${name}` }],
        isError: true,
      };
    }

    return result;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text", text: `Error: ${message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
