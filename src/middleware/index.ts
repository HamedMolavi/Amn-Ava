import { Router } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import flash from "connect-flash";
import cookieParser from "cookie-parser";
import passport from "passport";
import fileUpload from "express-fileupload";
import localVarMiddleware from "./localVar.middleware";
import { setupLogger } from "./logger.middleware";
import { makeSessionMiddleware } from "./session.middleware";
import { authHeaderExtraction } from "./auth.middleware";


export default function makeMiddlewares() {
  const router: Router = Router();


  ///////////////////////////////////////////////////////////////////////////////// Credentials and authentication
  router.use(
    cors({
      origin: "*",
      credentials: true,
    })
  );
  // router.use(function (req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header('Access-Control-Allow-Methods', 'DELETE, PUT, GET, POST');
  //   // res.header("Access-Control-Allow-Credentials", "true");
  //   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });
  router.use([
    cookieParser(),
    authHeaderExtraction,
    makeSessionMiddleware(),
    flash(),
    passport.initialize(),
    passport.session(),
  ]);
  ///////////////////////////////////////////////////////////////////////////////// Parsing & Logger
  router.use(
    bodyParser.json({ limit: "50mb" }),
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 50000,
    }),
    bodyParser.text({ limit: "200mb" }),
    fileUpload(),
    setupLogger("[REST]"),
    localVarMiddleware, //local variables setup
  );
  
  
  return router;
}