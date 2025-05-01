import { Express, NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Like, Repository } from "typeorm";
import H from "../helper/controllers/clientsController";
import { Clients } from "../entities/Clients";
import { validateOrReject } from "class-validator";
import { createPagination } from "../helper/pagination";
import tokenAuthorization from "../middlewares/tokenAuthorization";

export default (app: Express) => {
  const NAMESPACE: string = "/clients";
  const clientsRepository: Repository<Clients> =
    AppDataSource.getRepository(Clients);

  app.post(
    NAMESPACE,
    tokenAuthorization,
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        const { name, email, phone, born_date } = req.body;

        const client: Clients = new Clients();
        client.name = name;
        client.email = email;
        client.phone = phone;
        client.born_date = born_date;

        await validateOrReject(client);

        const result: Clients = await clientsRepository.save(client);

        res.status(201).send(result);
      } catch (error: unknown) {
        next(error);
      }
    }
  );

  app.put(
    NAMESPACE + "/:id",
    tokenAuthorization,
    async (req: Request, res: Response, next: NextFunction): Promise<any> => {
      try {
        const { id } = req.params;
        const { name, email, phone, born_date } = req.body;

        const client: Clients = await H.getClient(Number(id));
        client.name = name;
        client.email = email;
        client.phone = phone;
        client.born_date = born_date;

        await validateOrReject(client);

        const result: Clients = await clientsRepository.save(client);

        res.status(200).send(result);
      } catch (error: unknown) {
        next(error);
      }
    }
  );

  app.get(
    NAMESPACE,
    tokenAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const {
          page = 1,
          per_page = 10,
          orderBy = "id",
          sortBy = "ASC",
          search,
        } = req.query;

        const pageNumber: number = parseInt(page as string);
        const perPage: number = parseInt(per_page as string);

        let filters: any = [];

        if (search) {
          filters = [
            {
              name: Like(`%${search}%`),
            },
            {
              email: Like(`%${search}%`),
            },
          ];
        }

        const result: [Clients[], number] =
          await clientsRepository.findAndCount({
            where: filters,
            skip: Number(perPage * pageNumber - perPage),
            take: perPage,
            order: {
              [String(orderBy)]: sortBy,
            },
          });

        const pagination = createPagination(pageNumber, perPage, result[1]);

        res.status(200).send({ data: result[0], pagination });
      } catch (error: unknown) {
        next(error);
      }
    }
  );

  app.get(
    NAMESPACE + "/:id",
    tokenAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;

        const result: Clients = await H.getClient(Number(id));

        res.status(200).send(result);
      } catch (error: unknown) {
        next(error);
      }
    }
  );

  app.delete(
    NAMESPACE + "/:id",
    tokenAuthorization,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { id } = req.params;

        const result: Clients = await H.getClient(Number(id));

        await clientsRepository.remove(result);

        res.status(200).send({ message: "Usuário excluido com sucesso" });
      } catch (error: unknown) {
        next(error);
      }
    }
  );
};
