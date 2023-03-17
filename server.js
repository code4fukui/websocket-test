import { serveAPI } from "https://js.sabae.cc/wsutil.js";

const list = [];

serveAPI("/api", async (param, req, path, conninfo) => {
  if (path.endsWith("/api/ws")) {
    const { response, socket } = Deno.upgradeWebSocket(req);
    socket.remoteAddr = conninfo.remoteAddr.hostname;
    list.push(socket);
    socket.addEventListener("message", e => {
      console.log("message from WebSocket", e.timeStamp, e.data, typeof e.data);
      for (const sock of list) {
        try {
          sock.send(socket.remoteAddr + ": " + e.data);
        } catch (e) {
        }
      }
    });
    return response;
  }
  return "ok";
});
