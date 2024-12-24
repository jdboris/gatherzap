import express, { Request, Response } from "express";
import requestLogger from "./middleware/request-logger";

const app = express();
const { PORT, NODE_ENV } = process.env;

if (NODE_ENV == "development") {
  app.use(requestLogger);
}

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(PORT, () => {
  console.log("NODE_ENV: ", NODE_ENV);
  console.log(`Server is running on http://localhost:${PORT}`);
});
