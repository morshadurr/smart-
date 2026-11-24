const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StreamableHTTPServerTransport } = require("@modelcontextprotocol/sdk/server/streamableHttp.js");
const http = require("http");

const server = new McpServer({
  name: "smart-video-editor",
  version: "1.0.0"
});

server.tool(
  "smart_status",
  "Check the Smart Video Editor connection status",
  {},
  async () => ({
    content: [{
      type: "text",
      text: "Smart Video Editor MCP is connected and ready."
    }]
  })
);

const httpServer = http.createServer(async (req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      name: "Smart Video Editor MCP",
      status: "online"
    }));
    return;
  }

  if (req.url === "/mcp") {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    await server.connect(transport);
    await transport.handleRequest(req, res);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

httpServer.listen(process.env.PORT || 3000, "0.0.0.0");
