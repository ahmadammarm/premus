import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import loggerMiddleware from "./middlewares/loggerMiddleware";
import authrouter from "./routers/auth/authroutes";
import paymentrouter from "./routers/payment/paymentroutes";
import cors from "cors";
import premiumrouter from "./routers/premium/premiumroutes";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
app.use('/api/premium', premiumrouter);

app.use((request: Request, response: Response) => {
    response.status(404).json({ message: "Route not found" });
})

app.listen(port, () => {
    logger.info(`Server running at http://localhost:${port}`);
});
