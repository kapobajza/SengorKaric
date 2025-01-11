import { redirect } from "react-router";

import { hasSessionCookie } from "@/web/lib/session.server";
import { getEnvKey } from "@/web/env/get";
import { Button } from "@/web/components/ui/button";

import type { Route } from "./+types/route";

export function loader({ request }: Route.LoaderArgs) {
  if (hasSessionCookie(request)) {
    return redirect("/admin");
  }

  return null;
}

export default function AdminLogin() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center">
      <h1 className="mb-6 text-2xl">Log in to the admin dashboard!</h1>
      <a href={`${getEnvKey("PUBLIC_SK_API_URL")}/auth/google/login`}>
        <Button>Login with Google</Button>
      </a>
    </div>
  );
}
