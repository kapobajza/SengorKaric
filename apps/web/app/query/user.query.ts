import type { FetchQueryOptions } from "@tanstack/react-query";

import { api } from "@/web/networking/instance";
import { useQuery } from "@/web/hooks/query";

const usersQueryPrefix = "users";

export const userQueryKey = {
  me: [usersQueryPrefix, "me"],
} as const;

export const meQueryOptions = {
  queryKey: userQueryKey.me,
  queryFn() {
    return api().userApi.me();
  },
} satisfies FetchQueryOptions;

export function useMeQuery() {
  return useQuery(meQueryOptions);
}

export function useMeQueryCached() {
  return useQuery({
    ...meQueryOptions,
    staleTime: Infinity,
  });
}
