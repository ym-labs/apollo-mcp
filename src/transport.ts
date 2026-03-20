import express from "express";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { createServer } from "./server.js";
import { config } from "./config.js";

export async function startTransport(): Promise<void> {
  const app = express();
  app.use(express.json());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", server: "apollo-mcp", version: "0.1.0" });
  });

  // Streamable HTTP — stateless mode (each request gets its own server instance)
  app.post("/mcp", async (req, res) => {
    const server = createServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });
    res.on("close", () => {
      transport.close().catch(() => {});
      server.close().catch(() => {});
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  app.get("/mcp", (_req, res) => {
    res
      .status(405)
      .json({ error: "Method not allowed. Use POST to interact with the MCP server." });
  });

  app.delete("/mcp", (_req, res) => {
    res
      .status(405)
      .json({ error: "Method not allowed. This server runs in stateless mode." });
  });

  const port = config.PORT;
  app.listen(port, "0.0.0.0", () => {
    console.log(`Apollo MCP server listening on http://0.0.0.0:${port}`);
    console.log(`Health check: http://0.0.0.0:${port}/health`);
    console.log(`MCP endpoint: http://0.0.0.0:${port}/mcp`);
  });
}
