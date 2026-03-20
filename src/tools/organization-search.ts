import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apolloClient } from "../apollo/client.js";
import type { OrganizationSearchResponse } from "../apollo/types.js";
import { formatToolError } from "../errors.js";

const inputSchema = {
  organization_locations: z
    .array(z.string())
    .optional()
    .describe("Company HQ locations, e.g. ['United States', 'Germany']"),
  organization_num_employees_ranges: z
    .array(z.string())
    .optional()
    .describe(
      "Employee count ranges, e.g. ['1,10', '11,50', '51,200', '201,500', '501,1000', '1001,5000', '5001,10000', '10001,']",
    ),
  q_organization_keyword_tags: z
    .array(z.string())
    .optional()
    .describe("Industry or keyword tags, e.g. ['saas', 'fintech']"),
  organization_ids: z
    .array(z.string())
    .optional()
    .describe("Specific Apollo organization IDs to look up"),
  q_organization_name: z
    .string()
    .optional()
    .describe("Search by company name"),
  page: z
    .number()
    .int()
    .min(1)
    .max(500)
    .default(1)
    .describe("Page number (1-500)"),
  per_page: z
    .number()
    .int()
    .min(1)
    .max(100)
    .default(25)
    .describe("Results per page (1-100)"),
};

export function registerOrganizationSearch(server: McpServer): void {
  server.tool(
    "search_organizations",
    "Search Apollo.io's company database. Filter by industry keywords, employee count, location, and company name. Consumes credits.",
    inputSchema,
    async (params) => {
      try {
        const result =
          await apolloClient.post<OrganizationSearchResponse>(
            "/v1/mixed_companies/search",
            params,
          );
        return {
          content: [
            { type: "text" as const, text: JSON.stringify(result, null, 2) },
          ],
        };
      } catch (error) {
        return formatToolError(error);
      }
    },
  );
}
