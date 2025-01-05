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
        ...httpError,
        code: HttpErrorCode.Forbidden,
        statusCode: HttpErrorStatus.Forbidden,
      }),
    );
  }
}

export class HttpUnauthorizedError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        ...httpError,
        code: HttpErrorCode.Unauthorized,
        statusCode: HttpErrorStatus.Unauthorized,
      }),
    );
  }
}

export class HttpInternalServerError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        ...httpError,
        code: HttpErrorCode.InternalServerError,
        statusCode: HttpErrorStatus.InternalServerError,
      }),
    );
  }
}

export class HttpNotFoundError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        ...httpError,
        code: HttpErrorCode.NotFound,
        statusCode: HttpErrorStatus.NotFound,
      }),
    );
  }
}

export class HttpBadRequestError extends HttpError {
  constructor(httpError?: HttpErrorNarrow) {
    super(
      constructHttpErrorParams({
        ...httpError,
        code: HttpErrorCode.BadRequest,
        statusCode: HttpErrorStatus.BadRequest,
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
        ...httpError,
        code: HttpErrorCode.ValidationError,
        statusCode: HttpErrorStatus.UnprocessableEntity,
      }),
    );
    this.validationErrors = validationErrors;
  }
}
