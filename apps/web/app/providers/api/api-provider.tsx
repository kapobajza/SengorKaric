import type { ReactNode } from "react";

import type { ApiInstance } from "@/web/networking/instance";

import { ApiContext } from "./util";

export function ApiProvider({
  children,
  api,
}: {
  children: ReactNode;
  api: ApiInstance;
}) {
  return <ApiContext value={api}>{children}</ApiContext>;
}
