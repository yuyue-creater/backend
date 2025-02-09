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
    #dictionary = new Map();
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
        if (this.#dictionary.has(word)) {
            res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
            res.end(JSON.stringify({ message: this.#dictionary.get(word) }));
            
        } else {
            res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
            res.end(JSON.stringify({ message: `Request #${this.#requestCount}, word '${word}' not found` }));
        }
    }

    async #handlePost(req, res, reqUrl) {
        // Increment request count
        this.#requestCount++;

        // Handle wrong path
        if (!reqUrl.pathname.startsWith(this.#endpoint)) {
            res.writeHead(404).end();
            return;
        }
        // Get word from request
        const body = await this.#parseBody(req);

        // Handle words already existing
        if (this.#dictionary.has(body.word)) {
            res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
            res.end(JSON.stringify({ message: `Warning! '${body.word}' already exists` }));
            return;
        }
        // Check if word is valid
        if (!this.#isValidWord(body.word)) {
            // Bad request code
            res.writeHead(400, { [Server.contentType.type]: Server.contentType.plain }).end(`${body.word} is not a valid word.`);
            return;
        }
        // Add to definitions
        this.#dictionary.set(body.word, body.definition);
        // Get current month and day
        const date = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric" });
        // Send response
        res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
        res.end(JSON.stringify(
            { message: `Request #${this.#requestCount} (Updated at ${date}, Total Entries = ${this.#dictionary.size}): Added '${body.word}' - ${body.definition}` }
        ));
    }

    #parseBody(req) {
        return new Promise((res, rej) => {
            let body = "";
            req.on("data", chunk => body += chunk);
            req.on("end", () => res(JSON.parse(body)));
        });
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