import express, { Application, NextFunction, Request, Response } from "express";
import routes from "../routes/index.Routes";
import { ApiError } from "../types/classes/error.class";
import makeMiddlewares from "../middleware/index";
import http from "http";
import { httpErrorHandler } from "../error/http.error";
import https from "https";

export default function RestServer(hostUrl: string, options: { ports: { http: string | number, https: string | number }, options: any }) {

  //create express app
  const app: Application = express();

  ///////////////////////////////////////////////////////////////////////////////// middlewares
  app.use(makeMiddlewares());

  ///////////////////////////////////////////////////////////////////////////////// Routing
  //app routes
  app.use(routes);

  //404 route
  app.use(function notFound(req: Request, _res: Response, next: NextFunction) {
    const err = new ApiError(404, `Requested path ${req.path} not found`);
    next(err);
  });

  //app stack error handler
  app.use(function errorHandler(
    err: ApiError,
    _req: Request,
    res: Response,
    _next: NextFunction
  ) {
    const statusCode = err.statusCode || 500;
    if (err.message !== "File not found") {
      console.log("Error in endpoint: ", {
        success: false,
        message: err.message,
        stack: err.stack,
      });
    }
    return res.status(statusCode).send({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === "development" ? err.stack : "",
    });
  });
  const httpsServer = https.createServer(options.options, app).listen(options.ports.https, () => {
    console.log(`Server is running on https://${hostUrl}:${options.ports.https}`);
  }).on('error', httpErrorHandler);

  const httpServer = http.createServer(app).listen(options.ports.http, () => {
    console.log(`Server is running on http://${hostUrl}:${options.ports.http}`);
  }).on('error', httpErrorHandler);
  return { httpServer, httpsServer };
};