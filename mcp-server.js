const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify({
      name: "Smart Video Editor MCP",
      version: "1.0.0",
      status: "online"
    }));
    return;
  }

  if (req.method === "POST" && req.url === "/mcp") {
    let body = "";

    req.on("data", chunk => {
      body += chunk;
    });

    req.on("end", () => {
      res.end(JSON.stringify({
        jsonrpc: "2.0",
        id: JSON.parse(body).id,
        result: {
          status: "ok",
          message: "Smart Video Editor MCP is connected"
        }
      }));
    });

    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({
    error: "Not found"
  }));
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
