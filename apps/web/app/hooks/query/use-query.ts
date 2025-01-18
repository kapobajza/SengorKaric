import { useQuery } from "@tanstack/react-query";
import type { DefaultError, QueryKey } from "@tanstack/react-query";

import type { UseQueryOptions, UseQueryResult } from "./types";
import useIsEmptyQueryResult from "./use-is-empty-query-result";

export default function useCustomQuery<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(
  options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>,
): UseQueryResult<TData, TError> {
  const trQueryResult = useQuery(options);

  const isEmpty = useIsEmptyQueryResult({
    transformEmptyResult: options.transformEmptyResult,
    data: trQueryResult.data,
    status: trQueryResult.status,
  });

  return {
    ...trQueryResult,
    isEmpty,
  };
}
