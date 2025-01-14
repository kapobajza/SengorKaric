import { dehydrate, QueryClient } from "@tanstack/react-query";
import type {
  DefaultError,
  FetchQueryOptions,
  QueryFunctionContext,
  QueryKey,
} from "@tanstack/react-query";

import { api } from "@/web/networking/instance";
import type { ApiInstance } from "@/web/networking/instance";

export function defineQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = never,
>(
  options: Omit<
    FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey, TPageParam>,
    "queryFn"
  > & {
    queryFn: (
      context: QueryFunctionContext<TQueryKey, TPageParam> & {
        api: ApiInstance;
      },
    ) => Promise<TQueryFnData>;
  },
) {
  return {
    ...options,
    queryFn({ meta, ...otherOptions }) {
      const apiInstance = api(meta?.request as Request | undefined);

      // @ts-expect-error - Cannot properly type this
      return options.queryFn({
        ...otherOptions,
        meta,
        api: apiInstance,
      });
    },
  } satisfies FetchQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >;
}

export async function dehydratedQueryResponse<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  request: Request,
  prefetchQueryOptions: FetchQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >,
) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    ...prefetchQueryOptions,
    meta: {
      ...prefetchQueryOptions.meta,
      request,
    },
  });
  return Response.json({ dehydratedState: dehydrate(queryClient) });
}
