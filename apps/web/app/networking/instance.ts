import { createAuthApi } from "./auth.api";
import { createUploadApi } from "./upload.api";

export const api = () => ({
  authApi: createAuthApi(),
  uploadApi: createUploadApi(),
});

export type ApiInstance = ReturnType<typeof api>;
