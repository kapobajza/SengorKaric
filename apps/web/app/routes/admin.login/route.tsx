import { redirect } from "react-router";

import { hasSessionCookie } from "@/web/util/session.server";
import { isBrowser } from "@/web/util/util";
import { getEnvKey } from "@/web/env/get";

import type { Route } from "./+types/route";

export function loader({ request }: Route.LoaderArgs) {
  if (hasSessionCookie(request)) {
    return redirect("/admin/dashboard");
  }

  return null;
}

export default function AdminLogin() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <h1 className="text-2xl mb-6">Log in to the admin dashboard!</h1>
      {isBrowser() ? (
        <a href={`${getEnvKey("PUBLIC_SK_API_URL")}/auth/google/login`}>
          <button className="bg-blue-500 text-white hover:text-blue-900 font-bold py-2 px-4 rounded transition-all duration-300">
            Login with Google
          </button>
        </a>
      ) : null}
    </div>
  );
}
