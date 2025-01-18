import type { UploadAudioResponse } from "@/toolkit/dto";

import { createWebApiClient, defineApiConfig } from "./client";

export const createUploadApi = defineApiConfig((request) => {
  const uploadApi = createWebApiClient({
    routePrefix: "upload",
    request,
  });

  return {
    uploadAudio: async (data: Blob) => {
      const formData = new FormData();
      formData.append("audio", data, "recording.webm");

      return uploadApi.post<UploadAudioResponse>({
        route: "audio",
        body: formData,
      });
    },
  };
});
