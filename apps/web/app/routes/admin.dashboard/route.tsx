import { HTMLAttributes, ReactNode, useMemo } from "react";
import { createEditor, Descendant, Node, Transforms } from "slate";
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  withReact,
} from "slate-react";
import { useMutation } from "@tanstack/react-query";
import { withHistory } from "slate-history";

import { SlateAudioElement } from "@/web/types/slate";
import { redirectToLogin, verifyLoggedIn } from "@/web/util/session.server";
import { api } from "@/web/networking/instance";
import { useApi } from "@/web/providers/ApiProvider";

import AudioRecord from "./components/AudioRecord";
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

export function loader({ request }: Route.LoaderArgs) {
  verifyLoggedIn(request);
}

export async function action() {
  await api().authApi.logout();

  return redirectToLogin();
}

export default function SlateEditor() {
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
    <div className="container mx-auto p-4">
      {isPending ? <p>Uploading...</p> : null}
      <AudioRecord
        onRecordingStop={(data) => {
          mutate(data);
        }}
        disabled={isPending}
      />
      <Slate editor={editor} initialValue={initialValue}>
        <Editable
          renderElement={renderElement}
          placeholder="Enter some text..."
          className="p-4 mb-6 border border-gray-300 rounded-md"
          renderPlaceholder={({ attributes, children }) => (
            <div
              {...attributes}
              style={{
                fontStyle: "italic",
                color: "gray",
                position: "absolute",
                pointerEvents: "none",
                userSelect: "none",
              }}
              onClick={() => {
                ReactEditor.focus(editor);
              }}
            >
              {children}
            </div>
          )}
        />
      </Slate>
      <form method="post">
        <button
          className="bg-blue-500 hover:bg-blue-400 text-white hover:text-blue-900 font-bold py-2 px-4 rounded transition-opacity"
          type="submit"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
