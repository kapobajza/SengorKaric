import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    server: {
      deps: {
        inline: ["@fastify/autoload"],
      },
    },
    setupFiles: ["./src/test/setup.ts"],
  },
});
