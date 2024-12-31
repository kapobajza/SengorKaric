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

import AudioRecord from "./AudioRecord";

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

export default function SlateEditor() {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: Blob) => {
      const formData = new FormData();
      formData.append("audio", data, "recording.webm");

      const response = await fetch(
        "http://localhost:5050/sample/upload-audio",
        {
          method: "POST",
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Failed to upload audio");
      }

      const json = (await response.json()) as {
        text: string;
      };
      const url = URL.createObjectURL(data);

      const audioNode: Node = {
        type: "audio",
        src: url,
        children: [{ text: "" }],
      };

      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: json.text }],
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
    <div>
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
          style={{ padding: "10px" }}
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
    </div>
  );
}
