import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getEnv } from "../helper/validation";
import { CustomRequest } from "../../types/express";

const tokenAuthorization = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).send({ message: "Não autorizado." });
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  try {
    const decoded = jwt.verify(token, getEnv("AUTH_SECRET")) as JwtPayload;

    if (!decoded || typeof decoded !== "object" || decoded.type != "admin") {
      res.status(401).send({ message: "Não autorizado." });
      return;
    }

    req.token = token;
    req.currentUser = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      type: decoded.type,
    };

    next();
  } catch (error) {
    res.status(401).send({ message: "Não autorizado." });
  }
};

export default tokenAuthorization;
