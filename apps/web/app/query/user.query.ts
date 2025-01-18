import { useQuery } from "@/web/hooks/query";

import { defineQueryOptions } from "./util";

const usersQueryPrefix = "users";

export const userQueryKey = {
  me: [usersQueryPrefix, "me"],
} as const;

export const meQueryOptions = defineQueryOptions({
  queryKey: userQueryKey.me,
  queryFn({ api }) {
    return api.userApi.me();
  },
});

export function useMeQuery() {
  return useQuery(meQueryOptions);
}

export function useMeQueryCached() {
  return useQuery({
    ...meQueryOptions,
    staleTime: Infinity,
  });
}
