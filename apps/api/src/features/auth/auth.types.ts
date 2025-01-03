export type UserSession = {
  email: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
};

export type GoogleAuthResponseToken = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  id_token: string;
};
