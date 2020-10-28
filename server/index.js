import WebSocket from "ws";
import https from "https";
import fs from "fs";
import { dirname } from "path";
import url, { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = https.createServer({
  cert: fs.readFileSync(__dirname + "/certificates/cert.pem"),
  key: fs.readFileSync(__dirname + "/certificates/key.pem"),
});

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: ", message);
    ws.send("Received: " + message);
  });
});

server.on("upgrade", (request, socket, head) => {
  
  console.log(request.headers);

  if (request.headers.upgrade.toLowerCase() !== "websocket") {
    socket.end("HTTP/1.1 200 OK\r\n\r\n");
    return;
  }

  wss.handleUpgrade(request, socket, head, function done (ws) {
    console.log("upgrade");
    const pathname = url.parse(request.url).pathname;

    console.log("Path: ", pathname);

    console.log("Query Params: ", url.parse(request.url).query);

    console.log("Headers: ", request.headers);

    wss.emit("connection", ws, request);
  });
});

wss.on("error", (error) => {
  console.log("Error: ", error);
});

server.listen();