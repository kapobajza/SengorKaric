import crypto from "crypto";

import fp from "fastify-plugin";
import { createApiClient } from "@/toolkit/api";

import { registerServicePlugin } from "@/api/util/plugin";
import { generateSignedState } from "@/api/util/sign";

import { GoogleAuthResponseToken } from "./auth.types";

export type AuthService = {
  getGoogleAuthUri: () => {
    authorizationUrl: string;
    signedState: string;
  };
  exchangeGoogleAuthCode: (code: string) => Promise<GoogleAuthResponseToken>;
  refreshGoogleAccessToken: (
    refreshToken: string,
  ) => Promise<GoogleAuthResponseToken>;
};

export default fp((fastify, _opts, done) => {
  const env = fastify.getEnvs();

  const GOOGLE_OAUTH2_CONFIG = {
    authorizationUri: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUri: "https://oauth2.googleapis.com/token",
    userInfoUri: "https://www.googleapis.com/oauth2/v3/userinfo",
    clientId: env.GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: env.GOOGLE_OAUTH_CLIENT_SECRET,
    redirectUri: env.GOOGLE_OAUTH_REDIRECT_URI,
    scope: ["openid", "profile", "email"],
  };

  const googleOauthApiClient = createApiClient({
    baseUrl: GOOGLE_OAUTH2_CONFIG.tokenUri,
    options: {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      withCredentials: true,
    },
    logger: {
      error(message, args) {
        fastify.log.error(message, args);
      },
      info(message, args) {
        fastify.log.info(message, args);
      },
    },
  });

  const authService: AuthService = {
    getGoogleAuthUri() {
      const state = generateSignedState(
        { nonce: crypto.randomBytes(16).toString("hex") },
        env.GOOGLE_OAUTH_STATE_SECRET,
      );

      const queryParams = new URLSearchParams({
        client_id: GOOGLE_OAUTH2_CONFIG.clientId,
        redirect_uri: GOOGLE_OAUTH2_CONFIG.redirectUri,
        response_type: "code",
        scope: GOOGLE_OAUTH2_CONFIG.scope.join(" "),
        access_type: "offline", // Requests a refresh token
        state,
        prompt: "consent", // Force the user to consent so that we can get the refresh token
      });

      const authorizationUrl = `${GOOGLE_OAUTH2_CONFIG.authorizationUri}?${queryParams.toString()}`;

      return {
        authorizationUrl,
        signedState: state,
      };
    },
    async exchangeGoogleAuthCode(code) {
      const { data } = await googleOauthApiClient.post<GoogleAuthResponseToken>(
        {
          body: {
            code,
            client_id: GOOGLE_OAUTH2_CONFIG.clientId,
            client_secret: GOOGLE_OAUTH2_CONFIG.clientSecret,
            redirect_uri: GOOGLE_OAUTH2_CONFIG.redirectUri,
            grant_type: "authorization_code",
          },
        },
      );

      return data;
    },
    async refreshGoogleAccessToken(refreshToken) {
      const { data } = await googleOauthApiClient.post<GoogleAuthResponseToken>(
        {
          body: {
            refresh_token: refreshToken,
            client_id: GOOGLE_OAUTH2_CONFIG.clientId,
            client_secret: GOOGLE_OAUTH2_CONFIG.clientSecret,
            grant_type: "refresh_token",
          },
        },
      );

      return data;
    },
  };

  registerServicePlugin(fastify, { auth: authService });

  done();
});
