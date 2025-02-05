import { useRef, useState } from "react";
import type { ComponentRef } from "react";
import { AudioLines } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Transforms } from "slate";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/web/components/ui/dialog";
import { RichTextToolbarButton } from "@/web/components/rich-text/toolbar/rich-text-toolbar-button";
import { useRichText } from "@/web/components/rich-text/provider";

import { AudioRecordButton } from "./audio-record-button";

export function AudioRecordDialog() {
  const { editor } = useRichText();
  const [open, setOpen] = useState(false);
  const [isAudioRecording, setIsAudioRecording] = useState(false);
  const audioButtonRef = useRef<ComponentRef<typeof AudioRecordButton>>(null);

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen(false);
        audioButtonRef.current?.stop();
      }}
    >
      <RichTextToolbarButton
        name="audio"
        icon={AudioLines}
        label="Dodajte audio zapis"
        handleClick={() => {
          setOpen(true);
        }}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dodajte novi audio zapis</DialogTitle>
          <VisuallyHidden>
            <DialogDescription>
              Dodavanje novog audio zapisa u sadržaj.
            </DialogDescription>
          </VisuallyHidden>
        </DialogHeader>
        <div className="flex flex-col items-center gap-3">
          <AudioRecordButton
            ref={audioButtonRef}
            isRecording={isAudioRecording}
            setIsRecording={setIsAudioRecording}
            onRecordingStop={(blob) => {
              Transforms.insertNodes(editor, {
                type: "paragraph",
                children: [{ text: "Bla bla bla", type: "text" }],
              });
              Transforms.insertNodes(editor, {
                type: "audio",
                src: URL.createObjectURL(blob),
                children: [{ text: "", type: "text" }],
              });
              Transforms.insertNodes(editor, {
                type: "paragraph",
                children: [{ text: "", type: "text" }],
              });
              setOpen(false);
            }}
            className="rounded-full border-2 border-black p-3 dark:border-white [&>:svg]:size-6"
          />
          {isAudioRecording ? (
            <span>U toku je snimanje audio zapisa...</span>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
