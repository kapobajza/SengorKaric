import { readFileSync } from "fs";
import path from "path";

import speech from "@google-cloud/speech";
import fp from "fastify-plugin";
import { getRelativeMonoRepoPath } from "@/toolkit/util";

import { registerServicePlugin } from "@/api/util/plugin";

export type SpeechService = {
  transcribe: (base64Content: string) => Promise<string>;
};

const credentialsPath = path.join(
  getRelativeMonoRepoPath("api"),
  "gc_service_acc.json",
);
const credentials = JSON.parse(readFileSync(credentialsPath, "utf8")) as Record<
  string,
  string
>;

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

  registerServicePlugin(fastify, { speech: speechService });

  done();
});
