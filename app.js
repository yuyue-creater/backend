const http = require('http');
const url = require('url');

let dictionary = []; // Store dictionary words and definitions
let requestCount = 0; // To track total number of requests

const server = http.createServer((req, res) => {
  const reqUrl = url.parse(req.url, true);

  if (req.method === 'GET' && reqUrl.pathname === '/api/definitions') {
    // Get definition for a word
    const word = reqUrl.query.word;
    if (word) {
      const entry = dictionary.find(item => item.word.toLowerCase() === word.toLowerCase());
      if (entry) {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: `${entry.word}: ${entry.definition}` }));
      } else {
        res.writeHead(404, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: `Request #${requestCount}: Word '${word}' not found!` }));
      }
    } else {
      res.writeHead(400, {'Content-Type': 'application/json'});
      res.end(JSON.stringify({ message: 'Word query parameter is required' }));
    }
  }

  if (req.method === 'POST' && reqUrl.pathname === '/api/definitions') {
    // Handle adding a new word and definition
    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      const data = JSON.parse(body);
      const { word, definition } = data;

      if (!word || !definition || /\d/.test(word) || /\d/.test(definition)) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: 'Invalid input. Only non-empty strings are allowed.' }));
        return;
      }

      const existingEntry = dictionary.find(item => item.word.toLowerCase() === word.toLowerCase());

      if (existingEntry) {
        res.writeHead(400, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({ message: `Warning! The word '${word}' already exists.` }));
      } else {
        dictionary.push({ word, definition });
        requestCount++;
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify({
          message: `New entry recorded: "${word}: ${definition}"`,
          requestNumber: requestCount,
          totalEntries: dictionary.length
        }));
      }
    });
  }

  if (req.method === 'OPTIONS') {
    // Handle pre-flight requests for CORS
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
  }

});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
