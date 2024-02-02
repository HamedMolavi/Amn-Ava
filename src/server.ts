//import this file to correct global and modular types
import { } from "./types/index";
//initial file .env
require("./config/env.config")["default"](); //sync
//process error handling
require("./error/process.handler")["default"](); //sync
//imports
import setup from "./setups/index";
import { runInClusterMode } from "./tools/interactive.tools";
import WebSocketServer from "./apps/SocketIO.Application";
import RestServer from "./apps/REST.Application";


async function main() {
  setup()
    .then(setups => {
      const { OPTIONS, PORT_HTTPS, PORT_HTTP, HOST } = process.env;
      //                             SETUP YOUR SERVERS
      ////////////////////////////////////////////////////////////////////////////
      return RestServer(HOST, { ports: { http: parseInt(PORT_HTTP), https: parseInt(PORT_HTTPS) }, options: JSON.parse(OPTIONS as string) })
      ////////////////////////////////////////////////////////////////////////////
    })
    .then(({ httpServer, httpsServer }) => {
      const wss = WebSocketServer(httpServer);

    })
};

runInClusterMode(main);