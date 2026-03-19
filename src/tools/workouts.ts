import { Tool, CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { getWorkouts, getWorkout, PaginationParams } from "../client.js";

export const workoutTools: Tool[] = [
  {
    name: "get_workout_collection",
    description: "Get a paginated list of the user's workouts. Includes strain, heart rate zones, distance, kilojoules, and sport type.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of records to return (default 25, max 25)",
        },
        start: {
          type: "string",
          description: "Filter workouts starting after this ISO 8601 datetime",
        },
        end: {
          type: "string",
          description: "Filter workouts starting before this ISO 8601 datetime",
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
    name: "get_workout",
    description: "Get a single workout by ID",
    inputSchema: {
      type: "object",
      properties: {
        workoutId: {
          type: "number",
          description: "The ID of the workout to retrieve",
        },
      },
      required: ["workoutId"],
    },
  },
];

export async function handleWorkoutTool(name: string, args: Record<string, unknown>): Promise<CallToolResult | null> {
  if (name === "get_workout_collection") {
    const params: PaginationParams = {
      limit: args.limit as number | undefined,
      start: args.start as string | undefined,
      end: args.end as string | undefined,
      nextToken: args.nextToken as string | undefined,
    };
    const result = await getWorkouts(params);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  if (name === "get_workout") {
    const workoutId = args.workoutId as number;
    const result = await getWorkout(workoutId);
    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  }

  return null;
}
