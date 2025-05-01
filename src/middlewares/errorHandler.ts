import { NextFunction, Response, Request } from "express";

const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorMessage = error.message ?? error;

  const status = error.status || 500;

  const extraData = error.extraData || {};

  res.status(status).send({
    message: status
      ? errorMessage
      : `Erro interno do servidor! (${errorMessage})`,
    ...extraData,
  });
};

export default errorHandler;
