import express, { Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import loggerMiddleware from "./middlewares/loggerMiddleware";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
});


app.use(loggerMiddleware);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello, World!" });
});

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
