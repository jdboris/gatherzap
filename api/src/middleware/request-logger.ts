import express, { NextFunction, Request, Response } from "express";
import { EOL } from "node:os";

/**
 * Express middleware that logs the entire request in raw HTTP format.
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages
 */
export default function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
) {
  express.raw({ type: "*/*" })(req, res, () => {
    console.log(
      "------------------------------ REQUEST ------------------------------"
    );
    console.log(
      `${req.method.toUpperCase()} ${`${req.protocol}://${req.get("host")}${
        req.originalUrl
      }`} ${req.protocol.toUpperCase()}/${
        req.httpVersion
      }${EOL}${req.rawHeaders.reduce(
        // Convert raw headers array into key/value pairs with ':' between
        (total, x, i) => total + (i % 2 == 0 ? x : `: ${x}${EOL}`),
        ""
      )}${req.body ? EOL + req.body.toString("utf8") : ""}`
    );
    console.log(
      "---------------------------- REQUEST END ----------------------------"
    );
  });

  next();
}
