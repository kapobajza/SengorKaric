import { UserSession } from "@/api/features/login/login.types";

declare module "@fastify/secure-session" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface SessionData {
    user: UserSession;
    state: string;
  }
}
