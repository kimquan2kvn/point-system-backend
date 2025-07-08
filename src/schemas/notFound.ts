export const notFoundSchema = {
  $id: "notFound",
  type: "object",
  required: ["error"],
  properties: {
    error: { type: "string" },
  },
  additionalProperties: false,
};
