import { FastifyInstance } from "fastify";
import { meUserDtoSchema } from "@/toolkit/dto";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { eq } from "drizzle-orm";

import { HttpForbiddenError } from "@/api/error/throwable";
import { users } from "@/api/db/schema";

export default function usersRoute(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/me",
    {
      schema: {
        response: {
          200: meUserDtoSchema,
        },
      },
      preHandler: fastify.verifyUserSession,
    },
    async (request, reply) => {
      const user = request.session.user;

      if (!user) {
        throw new HttpForbiddenError();
      }

      const dbUsers = await fastify.db
        .select()
        .from(users)
        .where(eq(users.id, user.id))
        .limit(1);
      const dbUser = dbUsers[0];

      if (!dbUser) {
        throw new HttpForbiddenError();
      }

      return reply.status(200).send(dbUser);
    },
  );

  done();
}
