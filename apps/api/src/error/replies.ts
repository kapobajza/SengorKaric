import type { FastifyReply } from "fastify";
import type { ZodIssue } from "zod";

import {
  HttpErrorCode,
  HttpErrorStatus,
  type HttpValidationError,
  type ValidationError,
} from "./types";
import type { OkResponse } from "@/api/types/validation.types";

export const createErrorReply = (
  reply: FastifyReply,
  code: string,
  statusCode: number,
) => {
  return reply.status(statusCode).send({
    code,
    message: code,
    statusCode,
  });
};

export const createForbiddenReply = (reply: FastifyReply) => {
  return createErrorReply(reply, HttpErrorCode.Forbidden, 403);
};

export const createUnauthorizedReply = (reply: FastifyReply) => {
  return createErrorReply(reply, HttpErrorCode.Unathorized, 401);
};

export const createInternalServerErrorReply = (reply: FastifyReply) => {
  return createErrorReply(reply, HttpErrorCode.InternalServerError, 500);
};

export const createNotFoundReply = (reply: FastifyReply) => {
  return createErrorReply(reply, HttpErrorCode.NotFound, 404);
};

export const createOkReply = (reply: FastifyReply) => {
  return reply.send({ ok: true } satisfies OkResponse);
};

export const createValidationErrorReply = (
  reply: FastifyReply,
  issues: ZodIssue[],
) => {
  const responseError: HttpValidationError = {
    code: HttpErrorCode.ValidationError,
    message: "An error occured during validation",
    validationErrors: issues.map<ValidationError>((issue) => ({
      code: issue.code,
      message: issue.message,
      path: issue.path,
    })),
    statusCode: HttpErrorStatus.UnprocessableEntity,
  };

  return reply.status(responseError.statusCode).send(responseError);
};
