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
        <div>
          <audio
            controls
            src={props.element.src}
            {...props.attributes}
            data-slate-void={true}
          >
            <track kind="captions" />
          </audio>
          {props.children}
        </div>
      );
    },
    handleEnterKey() {
      // Prevent default behavior by doing nothing
    },
  },
};
