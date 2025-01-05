import { z } from "zod";

export const uploadAudioResponseSchema = z.object({
  text: z.string(),
});

export type UploadAudioResponse = z.infer<typeof uploadAudioResponseSchema>;
