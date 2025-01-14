import { createAuthApi } from "./auth.api";
import { createUploadApi } from "./upload.api";
import { createUserApi } from "./user.api";

export const api = (request?: Request) => ({
  authApi: createAuthApi(request),
  uploadApi: createUploadApi(request),
  userApi: createUserApi(request),
});

export type ApiInstance = ReturnType<typeof api>;
