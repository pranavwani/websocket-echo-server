import WebSocket from "ws";
import http from "http";
import fs from "fs";
import { dirname } from "path";
import url, { fileURLToPath } from "url";
import { networkInterfaces } from 'os';

const nets = networkInterfaces();
const results = Object.create(null); // or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      console.log(net, nets[name]);
        // skip over non-ipv4 and internal (i.e. 127.0.0.1) addresses
        if (net.family === 'IPv4' && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }

            results[name].push(net.address);
        }
    }
}

console.log(results);

const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(
  // {
  // cert: fs.readFileSync(__dirname + "/certificates/cert.pem"),
  // key: fs.readFileSync(__dirname + "/certificates/key.pem"),
// }
);

console.log("test");

const wss = new WebSocket.Server({ noServer: true });

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    console.log("received: ", message);
    ws.send("Received: " + message);
  });
});

server.on("upgrade", (request, socket, head) => {
  console.log(request.connection.localAddress);

  if (request.headers.upgrade.toLowerCase() !== "websocket") {
    socket.end("HTTP/1.1 200 OK\r\n\r\n");
    return;
  }

  wss.handleUpgrade(request, socket, head, function done(ws) {
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

server.listen(process.env.PORT || 5000);

console.log(process.env.PORT, server.address());
