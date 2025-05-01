import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Clients } from "../../entities/Clients";

const getClient = async (id: number) => {
  const clientsRepository: Repository<Clients> =
    AppDataSource.getRepository(Clients);

  const client: Clients | null = await clientsRepository.findOne({
    where: {
      id: id,
    },
  });

  if (!client)
    throw {
      message: "Usuário não encontrado.",
      status: 404,
    };

  return client;
};

export default { getClient };
