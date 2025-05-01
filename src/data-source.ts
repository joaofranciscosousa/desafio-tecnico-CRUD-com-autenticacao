import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { DataSource } from "typeorm";
import { Users } from "./entities/User";
import { getEnv } from "./helper/validation";
import { Clients } from "./entities/Clients";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: getEnv("MYSQLDB_HOST"),
  port: Number(getEnv("MYSQLDB_PORT")),
  username: getEnv("MYSQLDB_USERNAME"),
  password: getEnv("MYSQLDB_PASSWORD"),
  database: getEnv("MYSQLDB_DATABASE"),

  synchronize: false,
  logging: false,
  entities: [Clients, Users],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
  subscribers: [],
  connectorPackage: "mysql2",
});
