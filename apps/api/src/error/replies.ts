import type { FastifyReply } from "fastify";
import type { ZodIssue } from "zod";
import { HttpErrorCode, HttpErrorStatus } from "@/toolkit/api";

import type { OkResponse } from "@/api/types/validation.types";

import { type HttpValidationError, type ValidationError } from "./types";

export const createErrorReply = ({
  reply,
  code,
  statusCode,
  message,
}: {
  reply: FastifyReply;
  code: string;
  statusCode: number;
  message?: string;
}) => {
  return reply.status(statusCode).send({
    code,
    message: message ?? code,
    statusCode,
  });
};

export const createForbiddenReply = (reply: FastifyReply) => {
  return createErrorReply({
    reply,
    code: HttpErrorCode.Forbidden,
    statusCode: 403,
  });
};

export const createUnauthorizedReply = (reply: FastifyReply) => {
  return createErrorReply({
    reply,
    code: HttpErrorCode.Unathorized,
    statusCode: 401,
  });
};

export const createInternalServerErrorReply = (reply: FastifyReply) => {
  return createErrorReply({
    reply,
    code: HttpErrorCode.InternalServerError,
    statusCode: 500,
  });
};

export const createNotFoundReply = (reply: FastifyReply) => {
  return createErrorReply({
    reply,
    code: HttpErrorCode.NotFound,
    statusCode: 404,
  });
};

export const createBadRequestReply = (
  reply: FastifyReply,
  message?: string,
) => {
  return createErrorReply({
    reply,
    code: HttpErrorCode.BadRequest,
    statusCode: 400,
    message,
  });
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
