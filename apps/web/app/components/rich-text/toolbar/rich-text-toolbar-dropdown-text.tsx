import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from "@/web/components/ui/dropdown-menu";
import { Button } from "@/web/components/ui/button";
import { RichTextSelectedDropdownNodeMap } from "@/web/components/rich-text/types";
import type { RichTextSelectedDropdownNode } from "@/web/components/rich-text/types";
import { cn } from "@/web/lib/utils";
import { useRichText } from "@/web/components/rich-text/provider";
import { isHeadingNode } from "@/web/components/rich-text/util";

export function RichTextToolbarDropdownText({
  selected,
  setSelected,
}: {
  selected: RichTextSelectedDropdownNode;
  setSelected: React.Dispatch<
    React.SetStateAction<RichTextSelectedDropdownNode>
  >;
}) {
  const { blocks, editor } = useRichText();

  useEffect(() => {
    if (!editor.selection) {
      return;
    }

    const selectedNode = editor.children[editor.selection.focus.path[0] ?? -1];

    if (!selectedNode) {
      return;
    }

    if (selectedNode.type === "list") {
      setSelected(RichTextSelectedDropdownNodeMap.paragraph);
      return;
    }

    let selectedType: RichTextSelectedDropdownNode["value"];

    if (isHeadingNode(selectedNode)) {
      selectedType = `${selectedNode.type}-${selectedNode.level}`;
    } else {
      selectedType = selectedNode.type as RichTextSelectedDropdownNode["value"];
    }

    const selectedTextType = RichTextSelectedDropdownNodeMap[selectedType] as
      | RichTextSelectedDropdownNode
      | undefined;

    if (!selectedTextType) {
      return;
    }

    setSelected(selectedTextType);
  }, [blocks, editor.children, editor.selection, setSelected]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-28 justify-between px-2 py-1">
          {selected.label}
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          {Object.values(RichTextSelectedDropdownNodeMap).map((node) => (
            <DropdownMenuItem
              key={node.value}
              className={cn(
                "cursor-pointer px-2 py-1",
                selected === node && "bg-accent",
              )}
              onClick={() => {
                blocks[node.value].handleConvert?.(editor);
                setSelected(node);
              }}
            >
              {node.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
