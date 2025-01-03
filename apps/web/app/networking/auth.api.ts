import { createWebApiClient } from "./client";

export const createAuthApi = () => {
  const authApi = createWebApiClient({
    routePrefix: "auth",
  });

  return {
    logout: async () => {
      return authApi.post({
        route: "logout",
      });
    },
  };
};

export type AuthApi = ReturnType<typeof createAuthApi>;
