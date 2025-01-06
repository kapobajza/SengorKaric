import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Strikethrough,
  Underline,
} from "lucide-react";

import { Button } from "@/web/components/ui/button";
import { cn } from "@/web/lib/utils";

export function RichTextToolbar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-wrap gap-1 rounded-md bg-muted p-1", className)}
      {...props}
    >
      <Button variant="ghost" size="icon" aria-label="Bold">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Italic">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Underline">
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Strikethrough">
        <Strikethrough className="h-4 w-4" />
      </Button>
      <div className="mx-1 my-auto h-6 w-px bg-border" />
      <Button variant="ghost" size="icon" aria-label="Bullet List">
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Numbered List">
        <ListOrdered className="h-4 w-4" />
      </Button>
      <div className="mx-1 my-auto h-6 w-px bg-border" />
      <Button variant="ghost" size="icon" aria-label="Align Left">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Align Center">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" aria-label="Align Right">
        <AlignRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
