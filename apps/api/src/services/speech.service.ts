import fp from "fastify-plugin";
import { FastifyCustomProp } from "@/api/types/app.types";
import speech from "@google-cloud/speech";
import { readFileSync } from "fs";
import path from "path";
import { getRelativeMonoRepoPath } from "@/toolkit/util";

export type SpeechService = {
  transcribe: (base64Content: string) => Promise<string>;
};

const credentialsPath = path.join(
  getRelativeMonoRepoPath("api"),
  "gc_service_acc.json",
);
const credentials = JSON.parse(readFileSync(credentialsPath, "utf8"));

export default fp((fastify, _opts, done) => {
  const speechService: SpeechService = {
    async transcribe(content) {
      const client = new speech.SpeechClient({
        credentials,
      });

      const [response] = await client.recognize({
        audio: {
          content,
        },
        config: {
          encoding: "WEBM_OPUS",
          sampleRateHertz: 48000,
          languageCode: "ar-SA",
          enableWordTimeOffsets: true,
        },
      });

      const transcription = response.results
        ?.map((result) => result.alternatives?.[0]?.transcript)
        .join("\n");

      if (!transcription) {
        throw new Error("No transcription found");
      }

      return transcription;
    },
  };

  fastify.decorate(FastifyCustomProp.Service, {
    ...fastify.service,
    speech: speechService,
  });

  done();
});
