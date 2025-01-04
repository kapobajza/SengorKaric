import { redirect } from "react-router";
import cookie from "cookie";

import { getEnv } from "@/web/env/get";

const env = getEnv();

export function hasSessionCookie(request: Request) {
  const setCookie = request.headers.get("Cookie");

  if (!setCookie) {
    return false;
  }

  const parsedCookie = cookie.parse(setCookie);

  if (!parsedCookie[env.PRIVATE_SK_SESSION_COOKIE_NAME]) {
    return false;
  }

  return true;
}

export function redirectToLogin() {
  const clearSessionCookie = cookie.serialize(
    env.PRIVATE_SK_SESSION_COOKIE_NAME,
    "",
    {
      maxAge: 0,
      expires: new Date(0),
      path: "/",
    },
  );

  return redirect("/admin/login", {
    headers: {
      "Set-Cookie": clearSessionCookie,
    },
  });
}

export function verifyLoggedIn(request: Request) {
  try {
    if (!hasSessionCookie(request)) {
      throw redirectToLogin();
    }
  } catch {
    throw redirectToLogin();
  }
}
