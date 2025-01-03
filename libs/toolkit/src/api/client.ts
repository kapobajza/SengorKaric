import { HttpError, HttpErrorCode } from "./error";

type ApiMethodAdditionalOptions = {
  queryParams?: Record<string, string | number | boolean>;
};

export type ApiMethodOptions = Omit<
  RequestInit,
  "method" | "body" | "headers"
> &
  ApiMethodAdditionalOptions & {
    headers?: [string, string][] | Record<string, string | undefined | null>;
    /**
     * "`half`" is the only valid value and it is for initiating a half-duplex fetch (i.e., the user agent sends the entire request before processing the response). "`full`" is reserved for future use, for initiating a full-duplex fetch (i.e., the user agent can process the response before sending the entire request). This member needs to be set when [body](https://fetch.spec.whatwg.org/#dom-requestinit-body) is a [ReadableStream](https://streams.spec.whatwg.org/#readablestream) object.
     */
    duplex?: "half" | "full";
  };

type DoFetchOptions = RequestInit & ApiMethodAdditionalOptions;

export type ApiClientLogger = {
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
};

export type CreateApiOptions = {
  routePrefix?: string;
  onRequest?: (options: DoFetchOptions | undefined) => DoFetchOptions;
  baseUrl: string;
  options?: DoFetchOptions;
  logger?: ApiClientLogger;
};

export type CreateInstanceOptions = Omit<CreateApiOptions, "routePrefix">;

type FetchMethodOptions = {
  route?: string;
  options?: ApiMethodOptions;
};

type FetchMethodMutationOptions<TBody> = FetchMethodOptions & {
  body?: TBody;
};

export const createApiClient = ({
  routePrefix,
  onRequest,
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

  const constructBody = (
    body: BodyInit | undefined | null,
    contentType: string | undefined,
  ) => {
    if (!body) {
      return;
    }

    if (contentType === "application/json") {
      return JSON.stringify(body);
    }

    if (contentType === "application/x-www-form-urlencoded") {
      return new URLSearchParams(body as string).toString();
    }

    return body;
  };

  const createLogger = (
    url: string,
    method: string | undefined,
    options?: DoFetchOptions,
  ) => {
    if (!logger) {
      return;
    }

    const loggerOptions = options
      ? `with options: ${JSON.stringify(options)}`
      : undefined;

    const loggerMethod = method ? `[${method}] ` : "";

    return {
      info: () => {
        logger.info(
          `>>> API Client [Info]: Fetching ${loggerMethod}${url}`,
          loggerOptions,
        );
      },
      error: (error: HttpError) => {
        logger.error(
          `>>> API Client [Error]: Error fetching ${loggerMethod}${url}.\nMessage: ${error.message}\nCode: ${error.code}\nStatus Code: ${error.statusCode}`,
          loggerOptions,
        );
      },
    };
  };

  const doFetch = async <TResponse = unknown>(
    route: string | undefined,
    options?: DoFetchOptions,
  ) => {
    let opts = options ?? apiClientOptions ?? {};
    let { body } = opts;
    const { method } = opts;
    const headers = (options?.headers ?? {}) as Record<string, string>;

    body = constructBody(body, headers["Content-Type"]);

    if (!body) {
      delete headers["Content-Type"];
    }

    if (onRequest) {
      opts = onRequest(opts);
    }

    const requestUrl = constructRoute(route, options?.queryParams);
    const logger = createLogger(requestUrl, method, options);

    logger?.info();

    const res = await fetch(requestUrl, {
      ...options,
      body,
      headers,
    });

    if (!res.ok) {
      let errorToThrow: HttpError;

      try {
        errorToThrow = await (res.json() as Promise<HttpError>);
      } catch {
        errorToThrow = {
          code: HttpErrorCode.Unknown,
          message: "Unknown",
          statusCode: 500,
        };
      }

      logger?.error(errorToThrow);
      throw errorToThrow;
    }

    const data = (await res.json()) as TResponse;

    return {
      response: res,
      data,
    };
  };

  return {
    get: async <TResponse = unknown>(config?: FetchMethodOptions) => {
      return doFetch<TResponse>(config?.route, {
        ...config?.options,
        method: "GET",
        headers: config?.options?.headers as HeadersInit,
      });
    },
    post: async <TResponse = unknown, TBody = unknown>(
      config?: FetchMethodMutationOptions<TBody>,
    ) => {
      return doFetch<TResponse>(config?.route, {
        ...config?.options,
        method: "POST",
        body: config?.body as BodyInit,
        headers: {
          "Content-Type": "application/json",
          ...config?.options?.headers,
        },
      });
    },
    put: async <TResponse = unknown, TBody = unknown>(
      config?: FetchMethodMutationOptions<TBody>,
    ) => {
      return doFetch<TResponse>(config?.route, {
        ...config?.options,
        method: "PUT",
        body: config?.body as BodyInit,
        headers: {
          "Content-Type": "application/json",
          ...config?.options?.headers,
        },
      });
    },
    delete: async <TResponse = unknown>(config?: FetchMethodOptions) => {
      return doFetch<TResponse>(config?.route, {
        ...config?.options,
        headers: config?.options?.headers as HeadersInit,
        method: "DELETE",
      });
    },
  };
};
