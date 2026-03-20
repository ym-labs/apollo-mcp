import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apolloClient } from "../apollo/client.js";
import type { PeopleSearchResponse } from "../apollo/types.js";
import { formatToolError } from "../errors.js";

const inputSchema = {
  person_titles: z
    .array(z.string())
    .optional()
    .describe("Job titles to search for, e.g. ['CEO', 'CTO']"),
  person_locations: z
    .array(z.string())
    .optional()
    .describe("Person locations, e.g. ['San Francisco, CA']"),
  person_seniorities: z
    .array(
      z.enum([
        "owner",
        "founder",
        "c_suite",
        "partner",
        "vp",
        "head",
        "director",
        "manager",
        "senior",
        "entry",
      ]),
    )
    .optional()
    .describe("Seniority levels to filter by"),
  q_keywords: z
    .string()
    .optional()
    .describe("Full-text keyword search across person records"),
  organization_domains: z
    .array(z.string())
    .optional()
    .describe("Company domains to search within, e.g. ['apollo.io']"),
  organization_locations: z
    .array(z.string())
    .optional()
    .describe("Company HQ locations, e.g. ['United States']"),
  organization_num_employees_ranges: z
    .array(z.string())
    .optional()
    .describe(
      "Employee count ranges, e.g. ['1,10', '11,50', '51,200', '201,500', '501,1000', '1001,5000', '5001,10000', '10001,']",
    ),
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

export function registerPeopleSearch(server: McpServer): void {
  server.tool(
    "search_people",
    "Search Apollo.io's database of contacts. Filter by job title, location, seniority, company, domain, and more. Returns basic contact info without emails/phones — use enrich_person or bulk_enrich_people for full details. Does not consume credits.",
    inputSchema,
    async (params) => {
      try {
        const result =
          await apolloClient.post<PeopleSearchResponse>(
            "/v1/mixed_people/api_search",
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
