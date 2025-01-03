import { redirect } from "react-router";

import {
  commitSession,
  destroySession,
  getSession,
  redirectToLogin,
} from "@/web/util/session.server";
import { api } from "@/web/networking/instance";

import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;

  try {
    const { headers } = await api().authApi.checkGoogleAuth(
      searchParams,
      request.headers.get("Cookie"),
    );

    const setCookie = headers["set-cookie"]?.[0];

    if (setCookie) {
      const session = await getSession();
      session.set("api-session", setCookie);

      return redirect("/admin/dashboard", {
        headers: {
          "Set-Cookie": await commitSession(session, setCookie),
        },
      });
    }

    return redirectToLogin();
  } catch {
    await destroySession(request);
    return redirectToLogin();
  }
}

export default function AuthGoogleCallback() {
  return (
    <div className="absolute w-full h-screen flex justify-center items-center">
      Prijvavljujemo vas...
    </div>
  );
}
