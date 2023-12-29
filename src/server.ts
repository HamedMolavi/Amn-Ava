//import this file to correct global and modular types
import { } from "./types/index";
//initial file .env
require("./config/env.config")["default"](); //sync
//process error handling
require("./error/process.handler")["default"](); //sync
//imports
import http from "http";
import https from "https";
import app from "./apps/REST.Application";
import setup from "./setups/index";
import { runInClusterMode } from "./tools/interactive.tools";
import { httpErrorHandler } from "./error/http.error";


async function main() {
  setup()
    .then(_ => {
      const { OPTIONS, PORT_HTTPS, PORT_HTTP, HOST } = process.env;
      //                             SETUP YOUR SERVERS
      ////////////////////////////////////////////////////////////////////////////
      // run https server on port PORT_HTTPS
      const httpsServer = https.createServer(JSON.parse(OPTIONS as string), app).listen(PORT_HTTPS, () => {
        console.log(`Server is running on https://${HOST}:${PORT_HTTPS}`);
      }).on('error', httpErrorHandler);

      // run http server on port PORT_HTTP
      const httpServer = http.createServer(app).listen(PORT_HTTP, () => {
        console.log(`Server is running on http://${HOST}:${PORT_HTTP}`);
      }).on('error', httpErrorHandler);
      ////////////////////////////////////////////////////////////////////////////
      return { httpServer, httpsServer };
    })
    .then(({ httpServer, httpsServer })=>{
      
    })
};

runInClusterMode(main);