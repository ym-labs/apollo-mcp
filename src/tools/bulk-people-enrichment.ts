import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apolloClient } from "../apollo/client.js";
import type { BulkPeopleEnrichmentResponse } from "../apollo/types.js";
import { formatToolError } from "../errors.js";

const personDetail = z.object({
  email: z.string().email().optional().describe("Person's email address"),
  first_name: z.string().optional().describe("Person's first name"),
  last_name: z.string().optional().describe("Person's last name"),
  name: z.string().optional().describe("Person's full name"),
  domain: z.string().optional().describe("Company domain, e.g. 'apollo.io'"),
  linkedin_url: z
    .string()
    .url()
    .optional()
    .describe("Person's LinkedIn profile URL"),
  organization_name: z
    .string()
    .optional()
    .describe("Company name the person works at"),
  id: z.string().optional().describe("Apollo person ID"),
});

const inputSchema = {
  details: z
    .array(personDetail)
    .min(1)
    .max(10)
    .describe(
      "Array of person identifiers to enrich (1-10). Each entry should have at least one identifier: email, LinkedIn URL, name+domain, or Apollo ID.",
    ),
  reveal_personal_emails: z
    .boolean()
    .optional()
    .describe("Include personal emails for all people (consumes additional credits)"),
  reveal_phone_number: z
    .boolean()
    .optional()
    .describe("Include phone numbers for all people (consumes additional credits)"),
};

export function registerBulkPeopleEnrichment(server: McpServer): void {
  server.tool(
    "bulk_enrich_people",
    "Enrich up to 10 people at once from Apollo.io. Provide an array of person identifiers (email, LinkedIn URL, name+domain, or Apollo ID). More efficient than calling enrich_person multiple times. Consumes credits.",
    inputSchema,
    async (params) => {
      try {
        const result =
          await apolloClient.post<BulkPeopleEnrichmentResponse>(
            "/v1/people/bulk_match",
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
