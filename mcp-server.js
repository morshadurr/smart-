const http = require("http");

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const {
  StreamableHTTPServerTransport
} = require("@modelcontextprotocol/sdk/server/streamableHttp.js");

const PORT = process.env.PORT || 3000;

const MUSE_CHALLENGE =
  "muse-challenge=c3c0b44f86ce45c9109eae10ee25e656c0d51ecfb06d3da16980e430bb5a7a6e";

function createMcpServer() {
  const server = new McpServer({
    name: "smart-video-editor",
    version: "1.0.0"
  });

  server.tool(
    "smart_status",
    "Check Smart Video Editor MCP connection status",
    {},
    async () => ({
      content: [
        {
          type: "text",
          text: "Smart Video Editor MCP is connected and working."
        }
      ]
    })
  );

  return server;
}

const httpServer = http.createServer(async (req, res) => {
  // Muse verification challenge
  if (
    req.method === "GET" &&
    req.url ===
      "/.well-known/muse-challenge/c3c0b44f86ce45c9109eae10ee25e656c0d51ecfb06d3da16980e430bb5a7a6e"
  ) {
    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8"
    });

    res.end(MUSE_CHALLENGE);
    return;
  }

  // Server status
  if (req.method === "GET" && req.url === "/") {
    res.writeHead(200, {
      "Content-Type": "application/json"
    });

    res.end(
      JSON.stringify({
        name: "Smart Video Editor MCP",
        version: "1.0.0",
        status: "online",
        protocol: "Streamable HTTP"
      })
    );

    return;
  }

  // MCP endpoint
  if (req.url === "/mcp") {
    if (req.method !== "POST") {
      res.writeHead(405, {
        "Content-Type": "application/json",
        "Allow": "POST"
      });

      res.end(
        JSON.stringify({
          error: "Method not allowed"
        })
      );

      return;
    }

    const mcpServer = createMcpServer();

    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined
    });

    try {
      await mcpServer.connect(transport);
      await transport.handleRequest(req, res);

      res.on("close", () => {
        transport.close();
        mcpServer.close();
      });
    } catch (error) {
      console.error("MCP error:", error);

      if (!res.headersSent) {
        res.writeHead(500, {
          "Content-Type": "application/json"
        });

        res.end(
          JSON.stringify({
            error: "Internal MCP server error"
          })
        );
      }

      await transport.close();
      await mcpServer.close();
    }

    return;
  }

  // Not found
  res.writeHead(404, {
    "Content-Type": "application/json"
  });

  res.end(
    JSON.stringify({
      error: "Not found"
    })
  );
});

httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`Smart Video Editor MCP running on port ${PORT}`);
});
