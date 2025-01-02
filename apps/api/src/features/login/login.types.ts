import { z } from "zod";

export type UserSession = {
  email: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export const loginGoogleQueryParamsSchema = z.object({
  redirect: z.string(),
});
