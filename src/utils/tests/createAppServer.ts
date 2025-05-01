import express, { Application } from "express";
import bodyParser from "body-parser";
import errorHandler from "../../middlewares/errorHandler";
import typeormValidationError from "../../middlewares/typeormValidationError";

/**
 * Create application server to test
 * @param controllers Controllers to be added in application
 */
export default (controllers: Function[]): Application => {
  const app: Application = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  controllers.forEach((controller) => controller(app));

  app.use(typeormValidationError);
  app.use(errorHandler);

  return app;
};
