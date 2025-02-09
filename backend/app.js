const serverClass = require("./classes/serverClass");

// Server endpoints
const port = 8000;
const endpoint = "/api/definitions/";

const server = new serverClass.Server(endpoint, port);
server.start();