import { redirect } from "react-router";

import { getSession } from "@/web/util/session.server";
import { isBrowser } from "@/web/util/util";

import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSession(request);

  if (session.get("api-session")) {
    return redirect("/admin/dashboard");
  }

  return null;
}

export default function AdminLogin() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full">
      <h1 className="text-2xl mb-6">Log in to the admin dashboard!</h1>
      {isBrowser() ? (
        <a href={`${window.ENV.PUBLIC_SK_API_URL}/auth/google/login`}>
          <button className="bg-blue-500 hover:bg-blue-400 text-white hover:text-blue-900 font-bold py-2 px-4 rounded">
            Login with Google
          </button>
        </a>
      ) : null}
    </div>
  );
}
