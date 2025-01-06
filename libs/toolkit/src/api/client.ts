import axios, { AxiosError, AxiosRequestConfig } from "axios";

import {
  HttpError,
  HttpErrorCode,
  HttpErrorSchema,
  httpErrorSchema,
} from "./error";

type ApiMethodAdditionalOptions = {
  queryParams?: Record<string, string | number | boolean>;
};

export type ClientRequestOptions = AxiosRequestConfig &
  ApiMethodAdditionalOptions;

export type ApiClientLogger = {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
};

export type CreateApiOptions = {
  routePrefix?: string;
  baseUrl: string;
  options?: ClientRequestOptions;
  logger?: ApiClientLogger;
};

export type CreateInstanceOptions = Omit<CreateApiOptions, "routePrefix">;

type FetchMethodOptions = {
  route?: string;
} & Omit<AxiosRequestConfig, "method" | "data"> &
  ApiMethodAdditionalOptions;

type FetchMethodMutationOptions<TBody> = FetchMethodOptions & {
  body?: TBody;
};

export const createApiClient = ({
  routePrefix,
  baseUrl,
  options: apiClientOptions,
  logger,
}: CreateApiOptions) => {
  const constructRoute = (
    route: string | undefined,
    quryParams: Record<string, string | number | boolean> = {},
  ) => {
    const url = new URL(
      `${baseUrl}${routePrefix ? `/${routePrefix}` : ""}${route ? `/${route}` : ""}`,
    );

    for (const [key, value] of Object.entries(quryParams)) {
      url.searchParams.set(key, String(value));
    }

    return url.href;
  };

  const createLogger = (
    url: string,
    method: string | undefined,
    options?: ClientRequestOptions,
  ) => {
    if (!logger) {
      return;
    }

    let loggerOptions: string | undefined = undefined;

    if (options && (options.data || options.headers)) {
      loggerOptions = `with options: ${JSON.stringify({
        body: options.data as unknown,
        headers: options.headers,
      })}`;
    }

    const loggerMethod = method ? `[${method}] ` : "";

    return {
      info: () => {
        logger.info(
          `>>> API Client [Info]: Request ${loggerMethod}${url}`,
          loggerOptions,
        );
      },
      error: (error: HttpError, extraData: unknown = undefined) => {
        const extraInfo = extraData
          ? ` > Extra info: ${JSON.stringify(extraData)}`
          : "";
        logger.error(
          `>>> API Client [Error]: Error request ${loggerMethod}${url}. > Message: ${error.message} > Code: ${error.code} > Status Code: ${error.statusCode}${extraInfo}`,
          loggerOptions,
        );
      },
    };
  };

  const axiosInstance = axios.create({
    baseURL: baseUrl,
  });

  axiosInstance.interceptors.request.use((config) => {
    if (config.url && config.method) {
      const logger = createLogger(config.url, config.method, config);
      logger?.info();
    }

    return config;
  });

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      let errorToThrow: HttpErrorSchema;

      try {
        errorToThrow = httpErrorSchema.parse(error.response?.data);
      } catch {
        errorToThrow = {
          code: HttpErrorCode.Unknown,
          message: "Unknown",
          statusCode: 500,
        };
      }

      const logger = createLogger(
        error.config?.url ?? "unknown",
        error.config?.method,
        error.config,
      );

      logger?.error(new HttpError(errorToThrow), error.response?.data);
      throw new HttpError(errorToThrow);
    },
  );

  const doFetch = async <TResponse = unknown, TBody = unknown>(
    method: string,
    options:
      | (FetchMethodMutationOptions<TBody> & {
          route?: string;
        })
      | undefined,
  ) => {
    const { route, body } = options ?? {};
    const requestUrl = constructRoute(route, options?.queryParams);

    return axiosInstance<TResponse>({
      method,
      url: requestUrl,
      data: body,
      ...apiClientOptions,
      ...options,
    });
  };

  return {
    get: async <TResponse = unknown>(config?: FetchMethodOptions) => {
      return doFetch<TResponse>("GET", config);
    },
    post: async <TResponse = unknown, TBody = unknown>(
      config?: FetchMethodMutationOptions<TBody>,
    ) => {
      return doFetch<TResponse>("POST", config);
    },
    put: async <TResponse = unknown, TBody = unknown>(
      config?: FetchMethodMutationOptions<TBody>,
    ) => {
      return doFetch<TResponse>("PUT", config);
    },
    delete: async <TResponse = unknown>(config?: FetchMethodOptions) => {
      return doFetch<TResponse>("DELETE", config);
    },
  };
};
