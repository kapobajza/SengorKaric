import { UploadAudioResponse } from "@/toolkit/dto";

import { createWebApiClient } from "./client";

export const createUploadApi = () => {
  const uploadApi = createWebApiClient({
    routePrefix: "upload",
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
};
