import { FastifyPluginAsync } from "fastify";
import authenticationController from "../controller/authentication";

const authentication: FastifyPluginAsync = async (
  fastify,
  opts
): Promise<void> => {
  fastify.register(authenticationController, { prefix: "/v1/authen" });
};

export default authentication;
