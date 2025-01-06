import { z } from "zod";

export type UserSession = {
  email: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
  id: string;
};

export type GoogleAuthTokenResponse = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  id_token: string;
};

export type GoogleUserInfoResponse = {
  email: string;
  name: string;
  picture: string;
};

export const googleCheckQuerySchema = z.object({
  state: z.string(),
  code: z.string(),
  scope: z.string(),
  authuser: z.string(),
  prompt: z.string(),
});

export type GoogleCheckQuery = z.infer<typeof googleCheckQuerySchema>;
