import type {
  DefaultError,
  QueryKey,
  UndefinedInitialDataOptions,
  UseQueryResult as UseTRQueryResult,
  UseInfiniteQueryResult as UseTRInfiniteQueryResult,
  UseMutationOptions as UseTRMutationOptions,
} from "@tanstack/react-query";

export type AdditionalQueryOptions<TData = unknown> = {
  transformEmptyResult?: (data: TData | undefined) => boolean;
};

export type AdditionalQueryResult = {
  isEmpty: boolean;
};

export type UseQueryOptions<
  TQueryFnData = unknown,
  TError = DefaultError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = UndefinedInitialDataOptions<TQueryFnData, TError, TData, TQueryKey> &
  AdditionalQueryOptions<TData>;

export type UseQueryResult<
  TData = unknown,
  TError = DefaultError,
> = UseTRQueryResult<TData, TError> & AdditionalQueryResult;

export type UseInfiniteQueryResult<
  TData = unknown,
  TError = DefaultError,
> = UseTRInfiniteQueryResult<TData, TError> & AdditionalQueryResult;

export type UseMutationOptions<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
> = UseTRMutationOptions<TData, TError, TVariables, TContext> & {
  /** Show toast on error - default: true */
  showToast?: boolean;
};
