const http = require("http");
const url = require("url");

class Server {

    static contentType = Object.freeze({
        type: "Content-Type",
        json: "application/json",
        plain: "text/plain",
        html: "text/html"
    });

    #port;
    #server;
    #endpoint;
    #definitions = new Set();
    #requestCount = 0;

    constructor(endpoint, port) {
        this.#endpoint = endpoint;
        this.#port = port;
        this.#createServer();
    }
    
    start() {
        this.#server.listen(this.#port);
    }

    stop() {
        this.#server.close();
    }

    #createServer() {
        this.#server = http.createServer((req, res) => {
            this.#setupCORSHeader(res);

            // Handle options request
            if (req.method === "OPTIONS") {                
                res.writeHead(204).end(); // No content status code
                return;
            }
            // Handle request methods
            const receivedUrl = url.parse(req.url, true);
            if (req.method === "GET") this.#handleGet(req, res, receivedUrl);
            else if (req.method === "POST") this.#handlePost(req, res, receivedUrl);
        });
    }

    #handleGet(req, res, reqUrl) {
        // Increment request count
        this.#requestCount++;

        // Handle wrong path
        if (!reqUrl.pathname.startsWith(this.#endpoint)) {
            res.writeHead(404).end();
            return;
        }
        const word = reqUrl.query.word;
        if (this.#definitions.has(word)) {
            res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
            res.end(JSON.stringify({ message: this.#definitions.get(word) }));
            
        } else {
            res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
            res.end(JSON.stringify({ message: `Request #${this.#requestCount}, word '${word}' not found` }));
        }
    }

    #handlePost(req, res, reqUrl) {
        // Increment request count
        this.#requestCount++;

        // Handle wrong path
        if (!reqUrl.pathname.startsWith(this.#endpoint)) {
            res.writeHead(404).end();
            return;
        }
        // Get word from request
        const body = JSON.parse(req.JSON);
        // Handle words already existing
        if (this.#definitions.has(body.word)) {
            res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
            res.end(JSON.stringify({ message: `Error, the word '${body.word}' already exists` }));
            return;
        }
        // Check if word is valid
        if (!this.#isValidWord(body.word)) {
            // Bad request code
            res.writeHead(400, { [Server.contentType.type]: Server.contentType.plain }).end(`${body.word} is not a valid word.`);
            return;
        }
        // Add to definitions
        this.#definitions.add(body.word, body.definition);
        res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });        
        res.end(JSON.stringify(
            { message: `Request #${this.#requestCount}, definition for '${body.word}' added (Updated at ${new Date().getMonth()}${new Date().getDay()}). Total entries ${this.#definitions.size}` }
        ));
    }

    #setupCORSHeader(res) {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        res.setHeader("Access-Control-Allow-Headers", Server.contentType.type);
    }

    #isValidWord(word) {
        return !/\d/.test(word); // If word has digit, word not valid
    }
}

exports.Server = Server;