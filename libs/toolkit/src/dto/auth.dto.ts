import { z } from "zod";

export const googleAuthResponseDto = z.object({
  uri: z.string(),
});

export type GoogleAuthResponseDTO = z.infer<typeof googleAuthResponseDto>;
