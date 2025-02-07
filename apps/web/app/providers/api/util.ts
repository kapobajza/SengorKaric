import { createContext, useContext } from "react";

import type { ApiInstance } from "@/web/networking/instance";

export const ApiContext = createContext<ApiInstance | null>(null);

export function useApi() {
  const context = useContext(ApiContext);

  if (context === null) {
    throw new Error("useApi must be used within a ApiProvider");
  }

  return context;
}
