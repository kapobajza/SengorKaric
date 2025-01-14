import type { ZodIssueCode } from "zod";
import { z } from "zod";

export const HttpErrorStatus = {
  BadRequest: 400,
  Unauthorized: 401,
  Forbidden: 403,
  NotFound: 404,
  UnprocessableEntity: 422,
  InternalServerError: 500,
  NotImplemented: 501,
  ServiceUnavailable: 503,
} as const;

export const HttpErrorCode = {
  ValidationError: "validation_error",
  Unknown: "unknown",
  TranscriptionNotFound: "transcription_not_found",
} as const;

export const httpErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  code: z.string().optional(),
  error: z.string().optional(),
});

export type HttpErrorSchema = z.infer<typeof httpErrorSchema>;

export class HttpError extends Error implements HttpErrorSchema {
  statusCode: number;
  code: string | undefined;
  error: string | undefined;

  constructor({ statusCode, message, code, error }: HttpErrorSchema) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.error = error;
  }
}

export type ValidationError = {
  message: string;
  code: ZodIssueCode;
  path: (string | number)[];
};

type HttpErrorNarrow = Omit<
  HttpErrorSchema,
  "statusCode" | "code" | "message"
> & {
  message?: string;
  code?: string;
};

function constructHttpErrorParams(
  httpError: Omit<HttpErrorSchema, "message" | "code"> & {
    code?: string;
    message?: string;
  },
): HttpErrorSchema {
  return {
    ...httpError,
    message: httpError.message ?? httpError.code ?? HttpErrorCode.Unknown,
  };
}

export class HttpForbiddenError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        statusCode: HttpErrorStatus.Forbidden,
        ...httpError,
      }),
    );
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        statusCode: HttpErrorStatus.Unauthorized,
        ...httpError,
      }),
    );
  }
}

export class HttpInternalServerError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        statusCode: HttpErrorStatus.InternalServerError,
        ...httpError,
      }),
    );
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        statusCode: HttpErrorStatus.NotFound,
        ...httpError,
      }),
    );
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        statusCode: HttpErrorStatus.BadRequest,
        ...httpError,
      }),
    );
  }
}

export class HttpValidationError extends HttpError {
  validationErrors: ValidationError[];

  constructor({
    validationErrors,
    ...httpError
  }: HttpErrorNarrow & { validationErrors: ValidationError[] }) {
    super(
      constructHttpErrorParams({
        code: HttpErrorCode.ValidationError,
        statusCode: HttpErrorStatus.UnprocessableEntity,
        ...httpError,
      }),
    );
    this.validationErrors = validationErrors;
  }
}
