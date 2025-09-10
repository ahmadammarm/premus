import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import authrouter from "./routers/auth/authroutes";
import paymentrouter from "./routers/payment/paymentroutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use((request: Request, response: Response, next: NextFunction) => {
    response.set("Cache-Control", "no-store");
    next();
});

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (request: Request, response: Response) => {
    response.json({ message: "Hello, World!" });
});

app.use('/api/auth', authrouter);
app.use('/api/payment', paymentrouter);

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
