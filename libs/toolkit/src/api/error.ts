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
  Unauthorized: "unauthorized",
  Forbidden: "forbidden",
  NotFound: "not_found",
  InternalServerError: "internal_server_error",
  BadRequest: "bad_request",
  Unknown: "unknown",
} as const;

export const httpErrorSchema = z.object({
  statusCode: z.number(),
  message: z.string(),
  code: z.string(),
  error: z.string().optional(),
});

export type HttpErrorSchema = z.infer<typeof httpErrorSchema>;

export class HttpError extends Error implements HttpErrorSchema {
  statusCode: number;
  code: string;
  error: string | undefined;

  constructor({ statusCode, message, code, error }: HttpErrorSchema) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.error = error;
  }
}
