import type { HTMLAttributes, ReactNode } from "react";

import type { SlateAudioElement } from "@/web/types/slate";
import { verifyLoggedIn } from "@/web/lib/session.server";
import { dehydratedQueryResponse } from "@/web/query/util";
import { meQueryOptions } from "@/web/query/user.query";
import { RichTextEditor } from "@/web/components/rich-text";

import type { Route } from "./+types/route";

const AudioElement = ({
  attributes,
  element,
}: {
  attributes: HTMLAttributes<HTMLDivElement>;
  element: SlateAudioElement;
}) => (
  <div {...attributes} style={{ margin: "10px 0" }}>
    <audio controls src={element.src} />
  </div>
);

const DefaultElement = ({
  attributes,
  children,
}: {
  attributes: HTMLAttributes<HTMLParagraphElement>;
  children: ReactNode;
}) => (
  <div {...attributes} dir="ltr">
    {children}
  </div>
);

export async function loader({ request }: Route.LoaderArgs) {
  verifyLoggedIn(request);
  return dehydratedQueryResponse(request, meQueryOptions);
}

export default function Admin() {
  // const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  // const { uploadApi } = useApi();

  // const { mutate, isPending } = useMutation({
  //   mutationFn: async (data: Blob) => {
  //     const { data: uploadRes } = await uploadApi.uploadAudio(data);
  //     const url = URL.createObjectURL(data);

  //     const audioNode: Node = {
  //       type: "audio",
  //       src: url,
  //       children: [{ text: "" }],
  //     };

  //     Transforms.insertNodes(editor, {
  //       type: "paragraph",
  //       children: [{ text: uploadRes.text }],
  //     });
  //     Transforms.insertNodes(editor, audioNode);
  //     Transforms.insertNodes(editor, {
  //       type: "paragraph",
  //       children: [{ text: "" }],
  //     });
  //     Transforms.move(editor);
  //   },
  // });

  return (
    <div className="p-4 lg:max-w-[800px]">
      {/* {isPending ? <p>Uploading...</p> : null}
      <AudioRecord
        onRecordingStop={(data) => {
          mutate(data);
        }}
        disabled={isPending}
      /> */}
      <RichTextEditor />
    </div>
  );
}
