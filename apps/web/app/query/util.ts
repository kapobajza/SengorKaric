import { dehydrate, QueryClient } from "@tanstack/react-query";
import type {
  DefaultError,
  FetchQueryOptions,
  QueryKey,
} from "@tanstack/react-query";

export async function dehydratedQueryResponse<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  prefetchQueryOptions: FetchQueryOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey
  >,
) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(prefetchQueryOptions);
  return Response.json({ dehydratedState: dehydrate(queryClient) });
}
