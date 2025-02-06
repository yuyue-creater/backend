const http = require("http");

let requestCount = 0;
let dictionary = [];

const server = http.createServer((req, res) => {
  // Enable CORS headers for all domains
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all domains (you can replace "*" with a specific domain for better security)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow these HTTP methods
  res.setHeader("Access-Control-Allow-Headers", "Content-Type"); // Allow headers that can be sent in the request

  // Handle OPTIONS requests for preflight CORS check
  if (req.method === "OPTIONS") {
    res.writeHead(204); // No content, as it's just a preflight request
    return res.end();
  }

  if (req.method === "GET" && req.url.startsWith("/api/definitions")) {
    const query = new URLSearchParams(req.url.slice(req.url.indexOf('?'))); 
    const word = query.get("word");

    const entry = dictionary.find((entry) => entry.word === word);
    requestCount++;

    res.writeHead(200, { "Content-Type": "application/json" });
    if (entry) {
      res.end(JSON.stringify({ entry, requestCount }));
    } else {
      res.end(JSON.stringify({ requestCount, message: `Word '${word}' not found!` }));
    }
  } else if (req.method === "POST" && req.url === "/api/definitions") {
    let body = '';
    req.on("data", chunk => {
      body += chunk;
    });
    req.on("end", () => {
      const { word, definition } = JSON.parse(body);

      // Check if word already exists
      const existingEntry = dictionary.find(entry => entry.word === word);
      requestCount++;

      res.writeHead(200, { "Content-Type": "application/json" });
      if (existingEntry) {
        res.end(JSON.stringify({ message: `Warning! The word '${word}' already exists.`, requestCount }));
      } else {
        dictionary.push({ word, definition });
        res.end(JSON.stringify({ message: `New entry recorded: "${word}: ${definition}"`, requestCount, totalWords: dictionary.length }));
      }
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
