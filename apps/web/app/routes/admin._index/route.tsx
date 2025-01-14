import type { HTMLAttributes, ReactNode } from "react";
import { useMemo } from "react";
import type { Descendant, Node } from "slate";
import { createEditor, Transforms } from "slate";
import type { RenderElementProps } from "slate-react";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import { useMutation } from "@tanstack/react-query";
import { withHistory } from "slate-history";

import type { SlateAudioElement } from "@/web/types/slate";
import { verifyLoggedIn } from "@/web/lib/session.server";
import { useApi } from "@/web/providers/api-provider";
import { Textarea } from "@/web/components/ui/textarea";
import { dehydratedQueryResponse } from "@/web/query/util";
import { meQueryOptions } from "@/web/query/user.query";
import { RichTextToolbar } from "@/web/admin/components/rich-text/rich-text-toolbar";

import AudioRecord from "./components/audio-record";
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

const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case "audio":
      return <AudioElement {...props} element={props.element} />;
    default:
      return <DefaultElement {...props} />;
  }
};

export async function loader({ request }: Route.LoaderArgs) {
  verifyLoggedIn(request);
  return dehydratedQueryResponse(request, meQueryOptions);
}

export default function Admin() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const { uploadApi } = useApi();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Blob) => {
      const { data: uploadRes } = await uploadApi.uploadAudio(data);
      const url = URL.createObjectURL(data);

      const audioNode: Node = {
        type: "audio",
        src: url,
        children: [{ text: "" }],
      };

      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: uploadRes.text }],
      });
      Transforms.insertNodes(editor, audioNode);
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: "" }],
      });
      Transforms.move(editor);
    },
  });

  const initialValue: Descendant[] = [
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ];

  return (
    <div className="p-4 lg:max-w-[800px]">
      {isPending ? <p>Uploading...</p> : null}
      <AudioRecord
        onRecordingStop={(data) => {
          mutate(data);
        }}
        disabled={isPending}
      />
      <Slate editor={editor} initialValue={initialValue}>
        <RichTextToolbar className="mb-4" />
        <Textarea className="mb-6 block min-h-52" asChild>
          <Editable
            disableDefaultStyles
            renderElement={renderElement}
            placeholder="Enter some text..."
            renderPlaceholder={({ attributes, children }) => (
              <div
                {...attributes}
                style={{}}
                className="text-md pointer-events-none absolute italic text-gray-400 [user-select:none]"
                onClick={() => {
                  ReactEditor.focus(editor);
                }}
              >
                {children}
              </div>
            )}
          />
        </Textarea>
      </Slate>
    </div>
  );
}
