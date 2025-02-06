import { createAuthApi } from "./auth.api";
import { CreatePostApi } from "./posts.api";
import { createUploadApi } from "./upload.api";
import { createUserApi } from "./user.api";

export const api = (request?: Request) => ({
  authApi: createAuthApi(request),
  uploadApi: createUploadApi(request),
  userApi: createUserApi(request),
  postApi: CreatePostApi(request),
});

export type ApiInstance = ReturnType<typeof api>;
