import { reactRouter } from "@react-router/dev/vite";
import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

export default defineConfig(({ mode }) => {
  if (mode === "localhost") {
    dotenv.config({
      path: ".env.local",
    });
  }

  return {
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [reactRouter(), tsconfigPaths()],
    server: {
      port: parseInt(process.env.PORT ?? "3000", 10),
      strictPort: true,
      host: process.env.HOST ?? "0.0.0.0",
      open: false,
    },
  };
});
