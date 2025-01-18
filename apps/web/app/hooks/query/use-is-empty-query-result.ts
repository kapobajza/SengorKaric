import type { QueryStatus } from "@tanstack/react-query";

import type { AdditionalQueryOptions } from "./types";

const useIsEmptyQueryResult = <TData>({
  transformEmptyResult,
  data,
  status,
}: {
  transformEmptyResult: AdditionalQueryOptions<TData>["transformEmptyResult"];
  data: TData | undefined;
  status: QueryStatus;
}) => {
  let isEmpty = false;

  if (transformEmptyResult) {
    isEmpty = transformEmptyResult(data);
  } else if (Array.isArray(data)) {
    isEmpty = data.length === 0;
  } else if (data === undefined) {
    isEmpty = true;
  }

  return isEmpty && status !== "pending";
};

export default useIsEmptyQueryResult;
