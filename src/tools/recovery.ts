import { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getRecoveries, getRecovery, PaginationParams } from "../client.js";

export const recoveryTools: Tool[] = [
  {
    name: "get_recovery_collection",
    description: "Get a paginated list of the user's recovery scores. Recovery includes HRV, resting heart rate, SpO2, and skin temperature.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of records to return (default 25, max 25)",
        },
        start: {
          type: "string",
          description: "Filter recoveries starting after this ISO 8601 datetime",
        },
        end: {
          type: "string",
          description: "Filter recoveries starting before this ISO 8601 datetime",
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
    name: "get_recovery",
    description: "Get a single recovery record by ID",
    inputSchema: {
      type: "object",
      properties: {
        recoveryId: {
          type: "number",
          description: "The ID of the recovery to retrieve",
        },
      },
      required: ["recoveryId"],
    },
  },
];

export async function handleRecoveryTool(name: string, args: Record<string, unknown>): Promise<CallToolResult | null> {
  if (name === "get_recovery_collection") {
    const params: PaginationParams = {
      limit: args.limit as number | undefined,
      start: args.start as string | undefined,
      end: args.end as string | undefined,
      nextToken: args.nextToken as string | undefined,
    };
    const result = await getRecoveries(params);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === "get_recovery") {
    const recoveryId = args.recoveryId as number;
    const result = await getRecovery(recoveryId);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  return null;
}
