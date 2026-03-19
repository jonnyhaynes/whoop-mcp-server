import { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getCycles, getCycle, PaginationParams } from "../client.js";

export const cycleTools: Tool[] = [
  {
    name: "get_cycles",
    description: "Get a paginated list of the user's physiological cycles. Each cycle represents a WHOOP day (typically 24 hours) and includes strain score.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of records to return (default 25, max 25)",
        },
        start: {
          type: "string",
          description: "Filter cycles starting after this ISO 8601 datetime (e.g. 2024-01-01T00:00:00.000Z)",
        },
        end: {
          type: "string",
          description: "Filter cycles starting before this ISO 8601 datetime",
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
    name: "get_cycle",
    description: "Get a single physiological cycle by ID",
    inputSchema: {
      type: "object",
      properties: {
        cycleId: {
          type: "number",
          description: "The ID of the cycle to retrieve",
        },
      },
      required: ["cycleId"],
    },
  },
];

export async function handleCycleTool(name: string, args: Record<string, unknown>): Promise<CallToolResult | null> {
  if (name === "get_cycles") {
    const params: PaginationParams = {
      limit: args.limit as number | undefined,
      start: args.start as string | undefined,
      end: args.end as string | undefined,
      nextToken: args.nextToken as string | undefined,
    };
    const result = await getCycles(params);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === "get_cycle") {
    const cycleId = args.cycleId as number;
    const result = await getCycle(cycleId);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  return null;
}
