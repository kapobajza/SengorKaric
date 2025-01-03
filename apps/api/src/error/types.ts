import { HttpError } from "@/toolkit/api";
import type { ZodIssueCode } from "zod";

export type ValidationError = {
  message: string;
  code: ZodIssueCode;
  path: (string | number)[];
};

export type HttpValidationError = {
  validationErrors: ValidationError[];
} & HttpError;
