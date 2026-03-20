import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  registerPeopleSearch,
  registerOrganizationSearch,
  registerPeopleEnrichment,
  registerOrganizationEnrichment,
  registerBulkPeopleEnrichment,
  registerBulkOrganizationEnrichment,
} from "./tools/index.js";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "apollo-mcp",
    version: "0.1.0",
  });

  registerPeopleSearch(server);
  registerOrganizationSearch(server);
  registerPeopleEnrichment(server);
  registerOrganizationEnrichment(server);
  registerBulkPeopleEnrichment(server);
  registerBulkOrganizationEnrichment(server);

  return server;
}
