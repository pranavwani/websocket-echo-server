import WebSocket from "ws";

const ws = new WebSocket(
    "ws://localhost:8080", {
//   "ws://35.207.136.121/websocket/tracker/563/5bhxlydr/websocket?access_token=eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0MUBnbWFpbC5jb20iLCJhdXRoIjoiUk9MRV9BRE1JTiIsImV4cCI6MTYwMjI1NzgxM30.gkw3sWwke8FJRpRQ32MuxT-goAyPEFbTzRzsirhQeniW7J8jR6v8YU3_zR2o4UIWKo9j6Zr-Brt7R9WwJpv6gQ", {
    followRedirects: true,
    headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.4183.121 Safari/537.36"
    }
  }
);

ws.on('upgrade', function upgrade(response) {
  console.log("upgrade: ", response.headers);
});

ws.onopen = function open() {
  console.log("connected");
};

ws.onclose = function close() {
  console.log("disconnected");
};

ws.onmessage = function incoming(data) {
//   console.log("data: ", data);
};

ws.onerror = function error(stack) {
  console.log("error: ", stack.message);
};
