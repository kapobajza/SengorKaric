import {
  ApiClientLogger,
  createApiClient,
  CreateApiOptions,
} from "@/toolkit/api";

import { isBrowser } from "../util/util";
import { getEnvKey } from "../env/get";

const createLogger = (): ApiClientLogger | undefined => {
  if (isBrowser()) {
    return;
  }

  return {
    error(message, ...args) {
      // eslint-disable-next-line no-console
      console.error(message, ...args);
    },
    info(message, ...args) {
      // eslint-disable-next-line no-console
      console.log(message, ...args);
    },
  };
};

export const createWebApiClient = (
  options: Omit<CreateApiOptions, "logger" | "baseUrl">,
) => {
  return createApiClient({
    ...options,
    baseUrl: getEnvKey("PUBLIC_SK_API_URL"),
    logger: createLogger(),
  });
};
