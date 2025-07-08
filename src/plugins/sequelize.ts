("use strict");

import { FastifyPluginAsync } from "fastify";
import { Options, Sequelize } from "sequelize";
import fp from "fastify-plugin";

export interface SequelizePluginOptions {
  uri: string;
  sequelizeOptions?: Options;
  // TODO: strict type
  models?: any[];
}

const plugin: FastifyPluginAsync<SequelizePluginOptions> = async (
  fastify,
  options
) => {
  const logger = fastify.log.child({ module: "fastify-sequelize" });

  const { uri, models = [], sequelizeOptions = {} } = options;
  const defaultOptions: Options = {
    logging: (sql) => console.log(sql),
  };
  const combinedOptions = Object.assign(defaultOptions, sequelizeOptions);

  if (!fastify.sequelize) {
    try {
      const sequelize = new Sequelize(uri, combinedOptions);

      await sequelize.authenticate();
      console.log("Database connection is successfully established.");
      fastify.decorate("sequelize", sequelize);

      models.forEach((Model) => {
        if (Model.initModel) {
          Model.initModel(sequelize);
        }
      });

      models.forEach((Model) => {
        if (Model.afterInit) {
          Model.afterInit(sequelize);
        }
      });
      console.log("All models were initialized");

      // TODO: Sync database. Should use migraton on production env
      await sequelize.sync({
        alter: process.env.NODE_ENV === "development",
      });
      console.log("All models were synchronized successfully.");

      fastify.addHook("onClose", async (fastify) => {
        if (fastify.sequelize) {
          await fastify.sequelize.close();
        }
      });
    } catch (error) {
      logger.error(error);
      fastify.close();
    }
  }
};

export const sequelizePlugin = fp<SequelizePluginOptions>(plugin, {
  name: "fastify-sequelize",
});

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
  export interface FastifyInstance {
    sequelize: Sequelize;
  }
}
