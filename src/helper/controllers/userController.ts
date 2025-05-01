import { Repository } from "typeorm";
import { AppDataSource } from "../../data-source";
import { Users } from "../../entities/User";

const getUser = async (email: string) => {
  const userRepository: Repository<Users> = AppDataSource.getRepository(Users);

  const user: Users | null = await userRepository.findOne({
    where: {
      email,
    },
  });

  if (!user)
    throw {
      message: "Usuário não encontrado.",
      status: 404,
    };

  return user;
};

export default { getUser };
