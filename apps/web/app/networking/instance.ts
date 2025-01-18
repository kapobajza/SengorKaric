import { createAuthApi } from "./auth.api";
import { createUploadApi } from "./upload.api";
import { createUserApi } from "./user.api";

export const api = () => ({
  authApi: createAuthApi(),
  uploadApi: createUploadApi(),
  userApi: createUserApi(),
});

export type ApiInstance = ReturnType<typeof api>;
