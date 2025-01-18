import { z } from "zod";

export const meUserDtoSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  avatar: z.string().optional().nullable(),
});

export type UserMeDto = z.infer<typeof meUserDtoSchema>;
