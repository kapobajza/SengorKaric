import { Readable } from "stream";

import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";

import {
  createInternalServerErrorReply,
  createValidationErrorReply,
} from "@/api/error/replies";

const uploadAudioResponseSchema = z.object({
  text: z.string(),
});

const fileRequestSchema = z.object({
  filename: z.string(),
  file: z.instanceof(Readable),
  mimetype: z.literal("audio/webm"),
});

export default function sample(
  fastify: FastifyInstance,
  _opts: unknown,
  done: () => void,
) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/upload-audio",
    {
      schema: {
        response: {
          200: uploadAudioResponseSchema,
        },
      },
    },
    async (request, reply) => {
      try {
        const file = await request.file({
          limits: {
            fileSize: 1024 * 1024 * 10, // 10 MB
          },
        });
        const fileValidationRes = fileRequestSchema.safeParse(file);

        if (!fileValidationRes.success) {
          return createValidationErrorReply(
            reply,
            fileValidationRes.error.issues,
          );
        }

        const fileBase64 = (await file?.toBuffer())?.toString("base64");

        if (!fileBase64) {
          throw new Error("Failed to convert file to base64");
        }

        const transcribed = await fastify.service.speech.transcribe(fileBase64);

        return reply.send({
          text: transcribed,
        });
      } catch (err) {
        console.error("Error with audio file upload", err);
        return createInternalServerErrorReply(reply);
      }
    },
  );

  done();
}
