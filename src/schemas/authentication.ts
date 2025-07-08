import { FastifySchema } from "fastify";
import { headersJsonSchema } from "./headersJsonSchema";

export const loginSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      userName: { type: "string" },
      password: { type: "string" },
    },
    required: ["userName", "password"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" },
      },
    },
  },
};

export const registerSchema: FastifySchema = {
  body: {
    type: "object",
    properties: {
      userName: { type: "string" },
      password: { type: "string" },
      name: { type: "string" },
    },
    required: ["userName", "password", "name"],
  },
  response: {
    200: {
      type: "object",
      properties: {
        user_name: { type: "string" },
        id: { type: "string" },
        name: { type: "string" },
        role: { type: "number" },
      },
    },
  },
};

export const registersSchema: FastifySchema = {
  headers: headersJsonSchema,
  body: {
    type: "object",
    properties: {
      students: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
          },
        },
      },
    },
    required: ["students"],
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_name: { type: "string" },
          name: { type: "string" },
        },
      },
    },
  },
};

export const infoSchema: FastifySchema = {
  headers: headersJsonSchema,
  response: {
    200: {
      type: "object",
      properties: {
        user_name: { type: "string" },
        id: { type: "string" },
        name: { type: "string" },
        role: { type: "number" },
        createdAt: { type: "string" },
      },
    },
  },
};
