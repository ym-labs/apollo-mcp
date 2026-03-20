import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { apolloClient } from "../apollo/client.js";
import type { PersonEnrichmentResponse } from "../apollo/types.js";
import { formatToolError } from "../errors.js";

const inputSchema = {
  email: z
    .string()
    .email()
    .optional()
    .describe("Person's email address"),
  first_name: z.string().optional().describe("Person's first name"),
  last_name: z.string().optional().describe("Person's last name"),
  name: z.string().optional().describe("Person's full name"),
  domain: z
    .string()
    .optional()
    .describe("Company domain, e.g. 'apollo.io'"),
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
  reveal_personal_emails: z
    .boolean()
    .optional()
    .describe("Include personal emails (consumes additional credits)"),
  reveal_phone_number: z
    .boolean()
    .optional()
    .describe("Include phone numbers (consumes additional credits)"),
};

export function registerPeopleEnrichment(server: McpServer): void {
  server.tool(
    "enrich_person",
    "Enrich a single person's data from Apollo.io. Provide at least one identifier: email, LinkedIn URL, name+domain, or Apollo ID. Returns detailed contact info including email and employment history. Consumes credits.",
    inputSchema,
    async (params) => {
      try {
        const result =
          await apolloClient.post<PersonEnrichmentResponse>(
            "/v1/people/match",
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
