import type { UserMeDto } from "@/toolkit/dto";

import { createWebApiClient, defineApiConfig } from "./client";

export const createUserApi = defineApiConfig((request) => {
  const userApi = createWebApiClient({
    routePrefix: "users",
    request,
    options: {
      withCredentials: true,
    },
  });

  return {
    async me() {
      const { data } = await userApi.get<UserMeDto>({
        route: "me",
      });

      return data;
    },
  };
});

export type UserApi = ReturnType<typeof createUserApi>;
