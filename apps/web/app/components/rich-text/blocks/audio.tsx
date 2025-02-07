import { AudioLines } from "lucide-react";
import type React from "react";

import type { BlocksStore } from "@/web/components/rich-text/types";
import { isAudioNode } from "@/web/components/rich-text/util";

export const audioBlocks: Pick<BlocksStore, "audio"> = {
  audio: {
    icon: AudioLines,
    isInBlocksSelector: true,
    label: "Audio",
    matchNode(node) {
      return node.type === "audio";
    },
    renderElement(props) {
      if (!isAudioNode(props.element)) {
        return null as unknown as React.JSX.Element;
      }

      return (
        <audio controls src={props.element.src}>
          <track kind="captions">This is a track</track>
          Your browser does not support the audio element.
        </audio>
      );
    },
  },
};
