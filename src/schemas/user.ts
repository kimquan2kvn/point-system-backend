import { FastifySchema } from "fastify";
import { headersJsonSchema } from "./headersJsonSchema";

export const listUsersShema: FastifySchema = {
  headers: headersJsonSchema,
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_name: { type: "string" },
          id: { type: "string" },
          name: { type: "string" },
          role: { type: "number" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
        },
      },
    },
  },
};

export const updateUserShema: FastifySchema = {
  headers: headersJsonSchema,
  body: {
    type: "object",
    properties: {
      name: { type: "string" },
      role: { type: "number" },
      id: { type: "string" },
    },
    required: ["name", "role"],
  },
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
  },
};
export const deleteUserShema: FastifySchema = {
  headers: headersJsonSchema,
  params: {
    type: "object",
    properties: {
      id: { type: "string" },
    },
    required: ["id"],
    additionalProperties: false,
  },
};
