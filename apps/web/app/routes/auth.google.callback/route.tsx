import { redirect } from "react-router";

import { getEnv } from "@/web/env/get";
import { commitSession, getSession } from "@/web/util/session.server";

import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const env = getEnv();
  const { headers } = await fetch(
    `${env.PUBLIC_SK_API_URL}/auth/google/check?${searchParams.toString()}`,
    {
      headers: request.headers,
    },
  );

  const setCookie = headers.get("Set-Cookie");

  if (setCookie) {
    const session = await getSession();
    session.set("api-session", setCookie);

    return redirect("/admin/dashboard", {
      headers: {
        "Set-Cookie": await commitSession(session, setCookie),
      },
    });
  }

  return redirect("/admin/login");
}

export default function AuthGoogleCallback() {
  return (
    <div className="absolute w-full h-screen flex justify-center items-center">
      Loading...
    </div>
  );
}
