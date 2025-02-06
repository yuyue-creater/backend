const http = require('http');

const PORT = process.env.PORT || 3000;  // Use Render's assigned port

const dictionary = [];  // Store words and definitions in memory
let requestCount = 0;   // Track number of requests


const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const url = new URL(req.url, `http://${req.headers.host}`);

    if (req.method === 'GET' && url.pathname === '/api/definitions') {
        const word = url.searchParams.get('word');
        requestCount++;

        if (!word) {
            res.writeHead(400);
            res.end(JSON.stringify({ message: "Missing 'word' parameter." }));
            return;
        }

        const entry = dictionary.find(entry => entry.word.toLowerCase() === word.toLowerCase());
        if (entry) {
            res.end(JSON.stringify({ requestCount, entry }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ requestCount, message: `Word '${word}' not found!` }));
        }
    } else if (req.method === 'POST' && url.pathname === '/api/definitions') {
        let body = '';

        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { word, definition } = JSON.parse(body);
                requestCount++;

                if (!word || !definition || typeof word !== 'string' || typeof definition !== 'string') {
                    res.writeHead(400);
                    res.end(JSON.stringify({ message: "Invalid input. Provide 'word' and 'definition' as strings." }));
                    return;
                }

                if (dictionary.some(entry => entry.word.toLowerCase() === word.toLowerCase())) {
                    res.writeHead(409);
                    res.end(JSON.stringify({ message: `Warning! '${word}' already exists.` }));
                } else {
                    dictionary.push({ word, definition });
                    res.end(JSON.stringify({
                        requestCount,
                        totalWords: dictionary.length,
                        message: `New entry recorded: '${word} : ${definition}'`
                    }));
                }
            } catch (error) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Invalid JSON input." }));
            }
        });
    } else {
        res.writeHead(404);
        res.end(JSON.stringify({ message: "Invalid endpoint." }));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
