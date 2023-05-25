import "./loadEnviroment.js";
import chalk from "chalk";
import createDebug from "debug";
import app from "./server/app.js";
import { generalError } from "./server/middlewares/errorMiddlewares.js";

const debug = createDebug("nftify-api:root");

const port = process.env.PORT ?? 4000;

app.listen(port, () => {
  debug(`Listening on ${chalk.green(`http://localhost:${port}`)}`);

  app.use(generalError);
});
