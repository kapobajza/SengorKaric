import type { ApiClientLogger, CreateApiOptions } from "@/toolkit/api";
import { createApiClient } from "@/toolkit/api";

import { isBrowser } from "@/web/lib/utils";
import { getEnvKey } from "@/web/env/get";

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
  config: Omit<CreateApiOptions, "logger" | "baseUrl">,
) => {
  return createApiClient({
    ...config,
    baseUrl: getEnvKey("PUBLIC_SK_API_URL"),
    logger: createLogger(),
    options: {
      withCredentials: true,
      ...config.options,
    },
  });
};
