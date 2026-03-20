import { startTransport } from "./transport.js";

startTransport().catch((error) => {
  console.error("Failed to start Apollo MCP server:", error);
  process.exit(1);
});
