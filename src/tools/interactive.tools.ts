import cluster from 'cluster';
import { isInDebugMode } from "./utils.tools";


export function runInClusterMode(main: CallableFunction) {
  switch (true) {
    case !isInDebugMode() && (cluster.isPrimary ?? cluster.isMaster):
      console.log("=-=-= << Main running >> =-=-=");
      console.log("PID -> ", process.pid);
      cluster.fork();
      cluster.on("exit", (_worker, _code) => {
        console.log(`[main] restarting...\n`);
        cluster.fork();
      });
      process.on("SIGINT", () => {
        console.log("EXITING");
        process.exit(0);
      });
      break;
    case isInDebugMode():
      console.log("*".repeat(10));
      console.log("\tYou are running in debug mode! Commands will not work in this mode!");// default also will run...
      console.log("*".repeat(10));
    default:
      main();
      break;
  };
}