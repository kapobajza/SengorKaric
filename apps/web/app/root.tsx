import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import type { ReactNode } from "react";

import { ENV_PUBLIC_KEY_PREFIX, publicEnvSchema } from "@/web/env/schema";

import stylesheet from "./app.css?url";
import type { Route } from "./+types/root";
import { ApiProvider } from "./providers/api-provider";
import { api } from "./networking/instance";
import { ClientHintCheck } from "./components/client-hint-check";
import { useDehydratedState } from "./hooks/use-dehydrated-state";
import type { RootLoaderData } from "./types/loader";
import { ThemeAppearance } from "./theme/types";
import { getBrowserCookieThemeRaw, getHints } from "./lib/utils";
import { getThemeCookie } from "./lib/cookie.server";

export const links: Route.LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

export function loader({ request }: Route.LoaderArgs) {
  const publicEnv = Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      key.startsWith(ENV_PUBLIC_KEY_PREFIX),
    ),
  );
  const env = publicEnvSchema.parse(publicEnv);
  const theme = getThemeCookie(request);

  return Response.json({
    env,
    theme,
    requestInfo: {
      hints: getHints(request),
    },
  } satisfies RootLoaderData);
}

const apiInstance = api();

function Document({
  children,
  env,
  head,
  theme,
}: { children: ReactNode; head?: ReactNode } & Partial<RootLoaderData>) {
  const [queryClient] = useState(() => new QueryClient());
  const dehydratedState = useDehydratedState();

  return (
    <html lang="en" className={theme}>
      <head>
        <ClientHintCheck />
        {head}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <ApiProvider api={apiInstance}>
          <QueryClientProvider client={queryClient}>
            <HydrationBoundary state={dehydratedState}>
              {children}
            </HydrationBoundary>
          </QueryClientProvider>
        </ApiProvider>
        <ScrollRestoration />
        <Scripts />
        {env ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(env)}`,
            }}
          />
        ) : null}
      </body>
    </html>
  );
}

export default function App() {
  const data = useLoaderData<RootLoaderData | undefined>();

  return (
    <Document
      env={data?.env}
      theme={data?.theme ?? data?.requestInfo.hints.theme}
    >
      <Outlet />
    </Document>
  );
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
    <Document
      head={
        <script
          dangerouslySetInnerHTML={{
            __html: `
          const getBrowserCookieTheme = ${getBrowserCookieThemeRaw.toString()};
          let cookieTheme = getBrowserCookieTheme();

          if (cookieTheme) {
            document.documentElement.classList.add(cookieTheme === '${ThemeAppearance.Dark}' ? '${ThemeAppearance.Dark}' : '${ThemeAppearance.Light}');
          } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.classList.add('${ThemeAppearance.Dark}');
          }
        `,
          }}
        />
      }
    >
      <main className="container mx-auto p-4 pt-16">
        <h1>{message}</h1>
        <p>{details}</p>
        {stack ? (
          <pre className="w-full overflow-x-auto p-4">
            <code>{stack}</code>
          </pre>
        ) : null}
      </main>
    </Document>
  );
}
