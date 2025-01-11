import type { ReactNode } from "react";
import { createContext, useContext } from "react";

import type { ApiInstance } from "@/web/networking/instance";

const ApiContext = createContext<ApiInstance | null>(null);

export function ApiProvider({
  children,
  api,
}: {
  children: ReactNode;
  api: ApiInstance;
}) {
  return <ApiContext value={api}>{children}</ApiContext>;
}

export function useApi() {
  const context = useContext(ApiContext);

  if (context === null) {
    throw new Error("useApi must be used within a ApiProvider");
  }

  return context;
}
