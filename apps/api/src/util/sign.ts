import jwt from "jsonwebtoken";

export function generateSignedState<TState extends object>(
  state: TState,
  secret: string,
) {
  return jwt.sign(state, secret, {
    expiresIn: "5m",
  });
}

export function verifySignedState({
  state,
  secret,
}: {
  state: string;
  secret: string;
}): [Error, null] | [null, string] {
  try {
    const payload = jwt.verify(state, secret) as string;
    return [null, payload];
  } catch (err) {
    return [err instanceof Error ? err : new Error("Invalid state"), null];
  }
}
