import { FastifyPluginAsync } from "fastify";
import usersController from "../controller/user";

const authentication: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.register(usersController, { prefix: "/v1/user" });
};

export default authentication;
