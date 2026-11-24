const http = require("http");

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET" && req.url === "/") {
    res.end(JSON.stringify({
      name: "Smart Video Editor MCP",
      status: "online"
    }));
    return;
  }

  res.statusCode = 404;
  res.end(JSON.stringify({
    error: "Not found"
  }));
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Smart MCP server running on port ${PORT}`);
});
