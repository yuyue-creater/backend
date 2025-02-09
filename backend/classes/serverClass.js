const http = require("http");
const url = require("url");
const util = require("./utilsClass");

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
            util.Utils.writeCORSHead(res, Server.contentType.type);

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
        const body = await util.Utils.parseBody(req);

        // Handle words already existing
        if (this.#dictionary.has(body.word)) {
            res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
            res.end(JSON.stringify({ message: `Warning! '${body.word}' already exists` }));
            return;
        }
        // Check if word is valid
        if (!util.Utils.isValidWord(body.word)) {
            // Bad request code
            res.writeHead(400, { [Server.contentType.type]: Server.contentType.plain }).end(`${body.word} is not a valid word.`);
            return;
        }
        // Add to definitions
        this.#dictionary.set(body.word, body.definition);
        
        // Send response
        res.writeHead(200, { [Server.contentType.type]: Server.contentType.json });
        res.end(JSON.stringify(
            { message: `Request #${this.#requestCount} (Updated at ${util.Utils.getCurrentDate()}, Total Entries = ${this.#dictionary.size}): Added '${body.word}' - ${body.definition}` }
        ));
    }
}

exports.Server = Server;