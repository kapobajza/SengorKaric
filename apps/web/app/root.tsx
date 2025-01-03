import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { Env, ENV_PUBLIC_KEY_PREFIX, publicEnvSchema } from "@/web/env/schema";

import stylesheet from "./app.css?url";
import type { Route } from "./+types/root";
import { ApiProvider } from "./providers/ApiProvider";
import { api } from "./networking/instance";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function loader() {
  const publicEnv = Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      key.startsWith(ENV_PUBLIC_KEY_PREFIX),
    ),
  );
  const env = publicEnvSchema.parse(publicEnv);
  return Response.json({
    ENV: env,
  });
}

const apiInstance = api();

export function Layout({ children }: { children: React.ReactNode }) {
  const data = useLoaderData<{ ENV: Env } | undefined>();
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ApiProvider api={apiInstance}>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ApiProvider>
        <ScrollRestoration />
        <Scripts />
        {data?.ENV ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack ? (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      ) : null}
    </main>
  );
}
