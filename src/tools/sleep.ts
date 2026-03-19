import { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getSleepCollection, getSleep, PaginationParams } from "../client.js";

export const sleepTools: Tool[] = [
  {
    name: "get_sleep_collection",
    description: "Get a paginated list of the user's sleep activities. Includes sleep stages (light, REM, SWS), efficiency, performance, and respiratory rate.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of records to return (default 25, max 25)",
        },
        start: {
          type: "string",
          description: "Filter sleep activities starting after this ISO 8601 datetime",
        },
        end: {
          type: "string",
          description: "Filter sleep activities starting before this ISO 8601 datetime",
        },
        nextToken: {
          type: "string",
          description: "Pagination token from previous response to get the next page",
        },
      },
      required: [],
    },
  },
  {
    name: "get_sleep",
    description: "Get a single sleep activity by ID",
    inputSchema: {
      type: "object",
      properties: {
        sleepId: {
          type: "number",
          description: "The ID of the sleep activity to retrieve",
        },
      },
      required: ["sleepId"],
    },
  },
];

export async function handleSleepTool(name: string, args: Record<string, unknown>): Promise<CallToolResult | null> {
  if (name === "get_sleep_collection") {
    const params: PaginationParams = {
      limit: args.limit as number | undefined,
      start: args.start as string | undefined,
      end: args.end as string | undefined,
      nextToken: args.nextToken as string | undefined,
    };
    const result = await getSleepCollection(params);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === "get_sleep") {
    const sleepId = args.sleepId as number;
    const result = await getSleep(sleepId);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  return null;
}
