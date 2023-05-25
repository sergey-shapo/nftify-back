import express from "express";
import cors from "cors";
import morgan from "morgan";
import { generalError, notFoundError } from "./middlewares/errorMiddlewares.js";
import { pingController } from "./controllers/ping/pingController.js";

const app = express();

const trustedOrigins = [process.env.ALLOWED_ORIGIN_DEV!];

app.use(cors({ origin: trustedOrigins }));

app.disable("x-powered-by");

app.use(morgan("dev"));

app.use(express.json());

app.get("/ping", pingController);

app.use(generalError);

app.use(notFoundError);

export default app;
