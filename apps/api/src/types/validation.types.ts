import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export type IdParam = z.infer<typeof idParamSchema>;

export const okResponseSchema = z.object({ ok: z.boolean() });

export type OkResponse = z.infer<typeof okResponseSchema>;
