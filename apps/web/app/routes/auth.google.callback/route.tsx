import { redirect } from "react-router";

import { redirectToLogin } from "@/web/lib/session.server";
import { api } from "@/web/networking/instance";

import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;

  try {
    const { headers } =
      await api(request).authApi.checkGoogleAuth(searchParams);

    const setCookie = headers["set-cookie"]?.[0];

    if (!setCookie) {
      throw new Error("No cookie found");
    }

    return redirect("/admin", {
      headers: {
        "Set-Cookie": setCookie,
      },
    });
  } catch {
    return redirectToLogin();
  }
}

export default function AuthGoogleCallback() {
  return (
    <div className="absolute flex h-screen w-full items-center justify-center">
      Prijava je u toku...
    </div>
  );
}
