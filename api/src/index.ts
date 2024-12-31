import express, { Request, Response } from "express";
import requestLogger from "./middleware/request-logger";
import { COMING_SOON_MODE } from "./utils/feature-flags";

const app = express();
const { PORT, NODE_ENV } = process.env;

if (NODE_ENV == "development") {
  app.use(requestLogger);
}

app.use(express.json());

if (!COMING_SOON_MODE) {
  app.get("/", (_: Request, res: Response) => {
    res.send("hello world");
  });
}

app.listen(PORT, () => {
  console.log("NODE_ENV: ", NODE_ENV);
  console.log("COMING_SOON_MODE: ", COMING_SOON_MODE);
  console.log(`Server is running on http://localhost:${PORT}`);
});
