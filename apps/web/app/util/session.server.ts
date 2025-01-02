import { createCookieSessionStorage, redirect, Session } from "react-router";
import cookie from "cookie";

type SessionData = {
  "api-session": string;
};

const sessionStorage = createCookieSessionStorage<SessionData>({
  cookie: {
    name: "sengor_karic_local",
    secrets: ["s3cret1"],
  },
});

export function getSession(request?: Request) {
  return sessionStorage.getSession(request?.headers.get("Cookie"));
}

export function commitSession(session: Session, setCookie: string) {
  const parsedCookie = cookie.parse(setCookie);

  return sessionStorage.commitSession(session, {
    maxAge: parseInt(parsedCookie["Max-Age"] ?? "", 10),
    path: parsedCookie["Path"],
    sameSite: (parsedCookie["SameSite"] as "lax" | undefined) ?? "lax",
    secure: parsedCookie["Secure"] === "true",
  });
}

export function redirectToLogin(init?: number | ResponseInit) {
  return redirect("/admin/login", init);
}

export async function verifyLoggedIn(request: Request) {
  try {
    const session = await getSession(request);

    if (!session.get("api-session")) {
      throw redirectToLogin();
    }
  } catch {
    throw redirectToLogin();
  }
}

export async function destroySession(request: Request) {
  const session = await getSession(request);
  return sessionStorage.destroySession(session);
}
