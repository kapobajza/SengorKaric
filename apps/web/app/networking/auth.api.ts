import { createWebApiClient } from "./client";

export const createAuthApi = () => {
  const authApi = createWebApiClient({
    routePrefix: "auth",
  });

  return {
    logout: async () => {
      return authApi.post({
        route: "logout",
        body: {},
      });
    },
    checkGoogleAuth: async (
      searchParams: URLSearchParams,
      sessionCookie: string | undefined | null,
    ) => {
      return authApi.get({
        route: `google/check?${searchParams.toString()}`,
        options: {
          headers: {
            Cookie: sessionCookie,
          },
        },
      });
    },
  };
};

export type AuthApi = ReturnType<typeof createAuthApi>;
