import dotenv from "dotenv";
dotenv.config();

import { envs } from "./config/env";
import { PostgresDataBase } from "./data";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";

async function main() {

  const postgres = new PostgresDataBase({
    username: envs.DB_USERNAME,
    password: envs.DB_PASSWORD,
    host: envs.DB_HOST,
    database: envs.DB_DATABASE,
    port: envs.DB_PORT
})
await postgres.connect()

  const server = new Server({
    port: envs.PORT,
    routes: AppRoutes.routes
  });

  await server.start();
}

main();
