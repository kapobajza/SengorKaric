import { createAuthApi } from "./auth.api";

export const api = () => ({
  auth: createAuthApi(),
});
