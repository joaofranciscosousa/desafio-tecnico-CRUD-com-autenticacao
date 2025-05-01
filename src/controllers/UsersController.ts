import { Express, NextFunction, Request, Response } from "express";
import { Users } from "../entities/User";
import H from "../helper/controllers/userController";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getEnv } from "../helper/validation";

export default (app: Express) => {
  const NAMESPACE: string = "/users";

  app.post(
    NAMESPACE + "/sign_in",
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        const { email, password } = req.body;

        const user: Users = await H.getUser(email);

        const correct = await bcrypt.compare(password, user.password);

        if (!correct) {
          return res
            .status(401)
            .send({ message: "Email ou senha não conferem." });
        }

        const payload: Partial<Users> = { ...user };
        delete payload.password;

        return res.status(200).send({
          token: jwt.sign(payload, getEnv("AUTH_SECRET"), {
            expiresIn: "1h",
          }),
          name: user.name,
          email: user.email,
          type: user.type,
        });
      } catch (error: unknown) {
        next(error);
      }
    }
  );
};
