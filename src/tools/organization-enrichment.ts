import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apolloClient } from "../apollo/client.js";
import type { OrganizationEnrichmentResponse } from "../apollo/types.js";
import { formatToolError } from "../errors.js";

const inputSchema = {
  domain: z
    .string()
    .optional()
    .describe("Company domain, e.g. 'apollo.io'"),
  organization_name: z
    .string()
    .optional()
    .describe("Company name to look up"),
  id: z.string().optional().describe("Apollo organization ID"),
};

export function registerOrganizationEnrichment(server: McpServer): void {
  server.tool(
    "enrich_organization",
    "Enrich a company's data from Apollo.io by domain or name. Returns detailed company info including industry, employee count, funding, tech stack, and more. Consumes credits.",
    inputSchema,
    async (params) => {
      try {
        // This is a GET endpoint — convert params to query strings
        const queryParams: Record<string, string> = {};
        if (params.domain) queryParams.domain = params.domain;
        if (params.organization_name)
          queryParams.organization_name = params.organization_name;
        if (params.id) queryParams.id = params.id;

        const result =
          await apolloClient.get<OrganizationEnrichmentResponse>(
            "/v1/organizations/enrich",
            queryParams,
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
