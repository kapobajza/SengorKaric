import { useInfiniteQuery } from "@tanstack/react-query";
import type {
  DefaultError,
  DefinedInitialDataInfiniteOptions,
  InfiniteData,
  QueryKey,
} from "@tanstack/react-query";

import type { UseInfiniteQueryResult } from "./types";

export default function useCustomInfiniteQuery<
  TQueryFnData,
  TError = DefaultError,
  TData = InfiniteData<TQueryFnData>,
  TQueryKey extends QueryKey = QueryKey,
  TPageParam = unknown,
>(
  options: DefinedInitialDataInfiniteOptions<
    TQueryFnData,
    TError,
    TData,
    TQueryKey,
    TPageParam
  >,
): UseInfiniteQueryResult<TData, TError> {
  const trQueryResult = useInfiniteQuery(options);

  const isEmpty =
    (trQueryResult.data as Partial<InfiniteData<TQueryFnData>> | undefined)
      ?.pages?.length === 0;

  return {
    ...trQueryResult,
    isEmpty,
  };
}
