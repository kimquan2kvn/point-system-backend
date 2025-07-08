import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  infoSchema,
  loginSchema,
  registerSchema,
  registersSchema,
} from "../schemas/authentication";

export default async function authenticationController(
  fastify: FastifyInstance
) {
  fastify.get(
    "/info",
    { schema: infoSchema, onRequest: [fastify.authenticate] },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { id } = request.user as { id: string };

      return await fastify.authenticationService.getInfo(id);
    }
  );
  fastify.post(
    "/login",
    { schema: loginSchema },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { userName, password } = request.body as {
        userName: string;
        password: string;
      };

      const user = await fastify.authenticationService.login(
        userName,
        password
      );

      return {
        token: request.server.jwt.sign(user, { expiresIn: "30m" }),
      };
    }
  );
  fastify.post(
    "/register",
    { schema: registerSchema },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { name, password, userName } = request.body as {
        userName: string;
        password: string;
        name: string;
      };

      return await fastify.authenticationService.createUser(
        userName,
        password,
        name
      );
    }
  );
  fastify.post(
    "/create-multiple-users",
    { schema: registersSchema, onRequest: [fastify.authenticate] },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { students } = request.body as {
        students: { id: string; name: string }[];
      };
      const { role } = request.user as { role: number };

      return await fastify.authenticationService.createMultipleUsers(
        students,
        role
      );
    }
  );
}
