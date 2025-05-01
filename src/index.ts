import { AppDataSource } from "./data-source";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import morganBody from "morgan-body";
import UserController from "./controllers/UsersController";
import typeormValidationError from "./middlewares/typeormValidationError";
import errorHandler from "./middlewares/errorHandler";
import { getEnv } from "./helper/validation";
import ClientsController from "./controllers/ClientsController";

const app = express();

morganBody(app, { immediateReqLog: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }));

ClientsController(app);
UserController(app);

// Error handler
app.use(typeormValidationError);
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => console.info("Database Connected"))
  .catch((err) => {
    throw err;
  });

app.listen(getEnv("PORT"), () =>
  console.info(`Listening on port ${getEnv("PORT")}`)
);
