import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  deleteUserShema,
  listUsersShema,
  updateUserShema,
} from "../schemas/user";

export default async function usersController(fastify: FastifyInstance) {
  fastify.get(
    "/",
    { schema: listUsersShema, onRequest: [fastify.authenticate] },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { role } = request.query as { role?: number };

      return fastify.authenticationService.getUsers(role);
    }
  );
  fastify.put(
    "/:id",
    { schema: updateUserShema, onRequest: [fastify.authenticate] },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { name, role } = request.body as { name: string; role: number };
      const { id } = request.params as { id: string };
      return fastify.authenticationService.updateUser(id, name, role);
    }
  );
  fastify.delete(
    "/:id",
    { schema: deleteUserShema, onRequest: [fastify.authenticate] },
    async function (request: FastifyRequest, reply: FastifyReply) {
      const { id } = request.params as { id: string };
      return fastify.authenticationService.deleteUser(id);
    }
  );
}
