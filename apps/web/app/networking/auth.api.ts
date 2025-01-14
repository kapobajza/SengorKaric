import { createWebApiClient, defineApiConfig } from "./client";

export const createAuthApi = defineApiConfig((request) => {
  const authApi = createWebApiClient({
    routePrefix: "auth",
    request,
  });

  return {
    logout: async () => {
      return authApi.post({
        route: "logout",
        body: {},
      });
    },
    checkGoogleAuth: async (searchParams: URLSearchParams) => {
      return authApi.get({
        route: `google/check?${searchParams.toString()}`,
      });
    },
  };
});

export type AuthApi = ReturnType<typeof createAuthApi>;
