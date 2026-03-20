import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apolloClient } from "../apollo/client.js";
import type { BulkOrganizationEnrichmentResponse } from "../apollo/types.js";
import { formatToolError } from "../errors.js";

const inputSchema = {
  domains: z
    .array(z.string())
    .min(1)
    .max(10)
    .describe(
      "Array of company domains to enrich (1-10), e.g. ['apollo.io', 'google.com']",
    ),
};

export function registerBulkOrganizationEnrichment(server: McpServer): void {
  server.tool(
    "bulk_enrich_organizations",
    "Enrich up to 10 companies at once from Apollo.io by their domains. More efficient than calling enrich_organization multiple times. Returns detailed company info for each domain. Consumes credits.",
    inputSchema,
    async (params) => {
      try {
        const result =
          await apolloClient.post<BulkOrganizationEnrichmentResponse>(
            "/v1/organizations/bulk_enrich",
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
