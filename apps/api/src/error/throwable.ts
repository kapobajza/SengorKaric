import {
  HttpError,
  HttpErrorCode,
  HttpErrorSchema,
  HttpErrorStatus,
} from "@/toolkit/api";
import type { ZodIssueCode } from "zod";

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
  httpError: Omit<HttpErrorSchema, "message"> & {
    message?: string | undefined;
  },
): HttpErrorSchema {
  return {
    ...httpError,
    message: httpError.message ?? httpError.code,
  };
}

export class HttpForbiddenError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        code: HttpErrorCode.Forbidden,
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
        code: HttpErrorCode.Unauthorized,
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
        code: HttpErrorCode.InternalServerError,
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
        code: HttpErrorCode.NotFound,
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
        code: HttpErrorCode.BadRequest,
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
