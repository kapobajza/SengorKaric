import type { ThemeAppearance } from "@/web/theme/types";
import type { PublicEnv } from "@/web/env/schema";
import type { getHints } from "@/web/lib/utils";

export type RootLoaderData = {
  env: PublicEnv;
  theme: ThemeAppearance | undefined;
  requestInfo: { hints: ReturnType<typeof getHints> };
};
