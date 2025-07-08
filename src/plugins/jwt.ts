import fastifyJwt from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp(async (fastify, opts) => {
  fastify.register(fastifyJwt, {
    secret: "anhcute2k2",
  });

  fastify.decorate(
    "authenticate",
    async function (request: FastifyRequest, reply: FastifyReply) {
      try {
        const decode = await request.jwtVerify();

        request.user = decode;
      } catch (err) {
        reply.send(err);
      }
    }
  );
});

declare module "fastify" {
  export interface FastifyInstance {
    authenticate(): Promise<void>;
  }
}
