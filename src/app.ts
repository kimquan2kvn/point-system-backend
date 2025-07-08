import { join } from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { sequelizePlugin } from "./plugins/sequelize";
import { UserModel } from "./models/authenticationModel";
import AuthenticationService from "./services/authentication";
import SequelizeUserRepository from "./repositories/sequelize/sequelize.authentication.repository";
import cors from "@fastify/cors";

export type AppOptions = {} & Partial<AutoloadPluginOptions>;

const options: AppOptions = {};

declare module "fastify" {
  export interface FastifyInstance {
    authenticationService: AuthenticationService;
  }
}

async function connectToDatabases(fastify: FastifyInstance) {
  fastify.register(sequelizePlugin, {
    // uri: "postgresql://postgres:123456@localhost:5432/anhnh",
    uri: "postgresql://postgres:admin123@127.0.0.1:5432/postgres",
    models: [UserModel],
    sequelizeOptions: {
      logging: false,
    },
  });
}

async function decorateFastifyInstance(fastify: FastifyInstance) {
  const authenticationService = new AuthenticationService(
    new SequelizeUserRepository(UserModel)
  );

  fastify.decorate("authenticationService", authenticationService);
}

const app: FastifyPluginAsync<AppOptions> = async (
  fastify,
  opts
): Promise<void> => {
  void fastify.register(AutoLoad, {
    dir: join(__dirname, "plugins"),
    options: opts,
  });

  void fastify.register(AutoLoad, {
    dir: join(__dirname, "routes"),
    options: opts,
  });

  fastify
    .register(fp(connectToDatabases))
    .register(fp(decorateFastifyInstance))
    .register(cors, {
      origin: true,
      credentials: true,
    });
};

export default app;
export { app, options };
