import http from "http";
import { DisconnectReason, Server, Socket } from "socket.io";
import { passportGate } from "../authentication/authorize.auth";
import allowRequest from "../authentication/socketCheck.auth";
import passport from "passport";
import { wrapMiddlewareForSocketIo } from "../tools/socket.tools";
import { Http2SecureServer } from "http2";
import { authHeaderExtraction } from "../middleware/auth.middleware";
import { makeSessionMiddleware } from "../middleware/session.middleware";
import { setupLogger } from "../middleware/logger.middleware";

export function WebSocketServer(httpServer: http.Server) {
  // run http websocket
  const io = new Server(httpServer, {
    // path: "/my-custom-path/",
    cors: {
      origin: "*",
      // allowedHeaders: ["my-custom-header"],
      // credentials: true
    },
    allowRequest, // session is not initialized yet, just check requirements.
    // allowUpgrades,
    // initialPacket,
    // transports:["polling","websocket"],
  });

  //morgan logger setup on socket.request
  for (const fn of setupLogger("[Socket]")) io.use(wrapMiddlewareForSocketIo(fn));

  //authorize user
  io.use(wrapMiddlewareForSocketIo(authHeaderExtraction))
  io.use(wrapMiddlewareForSocketIo(makeSessionMiddleware()));
  io.use(wrapMiddlewareForSocketIo(passport.initialize()));
  io.use(wrapMiddlewareForSocketIo(passport.session()));
  io.use(wrapMiddlewareForSocketIo(passportGate));

  // TODO: setuping new socket connection
  io.on("connection", async function setupNewSocket(socket: Socket) {
    joinRoom(socket);
    socket.on("disconnect", (reason, description) => disconnect(socket, reason, description));
  });





  async function joinRoom(socket: Socket): Promise<void> {
    if (!socket.handshake.headers["chatid"]) socket.disconnect();
    else {
      socket.join(socket.handshake.headers["chatid"]);
      socket.on
    }
    return;
  };
  function disconnect(socket: Socket, _reason: DisconnectReason, _description?: any) {
    return;
  };
  return io;
};


export default WebSocketServer;