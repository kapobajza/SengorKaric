import crypto from "crypto";

import { z } from "zod";

const signedStateSchema = z.object({
  data: z.string(),
  signature: z.string(),
});

export function generateSignedState<TState extends Record<string, unknown>>(
  state: TState,
  secret: string,
) {
  const dataString = JSON.stringify(state);

  const signature = crypto
    .createHmac("sha256", secret)
    .update(dataString)
    .digest("base64url");

  return Buffer.from(JSON.stringify({ data: dataString, signature })).toString(
    "base64url",
  );
}

export function verifySignedState<TState extends Record<string, unknown>>({
  signedState,
  secret,
  schema,
}: {
  signedState: string;
  secret: string;
  schema: z.ZodType<TState>;
}): [Error, null] | [null, TState] {
  try {
    const parsedState = JSON.parse(
      Buffer.from(signedState, "base64url").toString("utf-8"),
    ) as unknown;

    const { data, signature } = signedStateSchema.parse(parsedState);

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(data)
      .digest("base64url");

    if (signature !== expectedSignature) {
      throw new Error("Invalid state signature");
    }

    const parsedData = JSON.parse(data) as unknown;
    return [null, schema.parse(parsedData)];
  } catch (err) {
    return [err instanceof Error ? err : new Error("Invalid state"), null];
  }
}
