import { verifyLoggedIn } from "@/web/lib/session.server";
import { dehydratedQueryResponse } from "@/web/query/util";
import { meQueryOptions } from "@/web/query/user.query";
import { RichTextEditor } from "@/web/components/rich-text";

import type { Route } from "./+types/route";

export async function loader({ request }: Route.LoaderArgs) {
  verifyLoggedIn(request);
  return dehydratedQueryResponse(request, meQueryOptions);
}

export default function Admin() {
  return (
    <div className="p-4 lg:max-w-[800px]">
      <RichTextEditor />
    </div>
  );
}
