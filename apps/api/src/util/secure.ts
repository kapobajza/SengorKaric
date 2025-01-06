import crypto from "crypto";

export function generateUDID() {
  return [8, 4, 4, 4, 12]
    .map((n) => crypto.randomBytes(n / 2).toString("hex"))
    .join("-");
}
