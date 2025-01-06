import type { UserMeDto } from "@/toolkit/dto";

import { createWebApiClient } from "./client";

export const createUserApi = () => {
  const userApi = createWebApiClient({
    routePrefix: "users",
  });

  return {
    async me() {
      const { data } = await userApi.get<UserMeDto>({
        route: "me",
      });

      return data;
    },
  };
};

export type UserApi = ReturnType<typeof createUserApi>;
