import { FastifyReply } from "fastify";

import { OkResponse } from "@/api/types/validation.types";

export const createOkReply = (reply: FastifyReply) => {
  return reply.send({ ok: true } satisfies OkResponse);
};
