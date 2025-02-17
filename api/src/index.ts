import express, { NextFunction, Request, Response } from "express";
import requestLogger from "./middleware/request-logger";
import authRouter from "./routes/auth-router";
import { extend } from "./utils/express-extension";
import { COMING_SOON_MODE } from "./utils/feature-flags";
import accountRouter from "./routes/account-router";
import HttpError from "./utils/http-error";

const { PORT, NODE_ENV } = process.env;

const app = extend(express());

if (COMING_SOON_MODE) {
  app.use(/.*/, (_: Request, res: Response) => {
    res.status(404).send();
  });
}

if (NODE_ENV == "development") {
  app.use(requestLogger);
}

app.use(express.json());

app.use(authRouter);
app.use(accountRouter);

app.use(async (error: Error, _: Request, res: Response, __: NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.status).send({
      error: error.message,
    });
    return;
  }

  console.error(error);
  res.status(500).send({
    error: "Something went wrong. Please try again.",
  });
});

app.listen(PORT, () => {
  console.log("NODE_ENV: ", NODE_ENV);
  console.log("COMING_SOON_MODE: ", COMING_SOON_MODE);
  console.log(`Server is running on http://localhost:${PORT}`);
});
