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
  Unathorized: "unauthorized",
  Forbidden: "forbidden",
  NotFound: "not_found",
  InternalServerError: "internal_server_error",
  BadRequest: "bad_request",
  Unknown: "unknown",
} as const;

export type HttpError = {
  statusCode: number;
  message: string;
  code: string;
};
