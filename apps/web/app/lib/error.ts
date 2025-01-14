import { HttpError, HttpErrorCode, HttpErrorStatus } from "@/toolkit/api";

export function constructErrorMessage(error: Error) {
  if (error instanceof HttpError) {
    if (error.code === HttpErrorCode.TranscriptionNotFound) {
      return "Transkripcija nije moguća. Provjerite da li Vam je mikrofon uključen i da li radi kako treba.";
    }

    if (error.statusCode === HttpErrorStatus.NotFound) {
      return "Resurs nije pronađen.";
    }
  }

  return "Nepoznata greška.";
}
