import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

import { cn } from "@/web/lib/utils";

const Textarea = ({
  className,
  ref,
  asChild,
  ...props
}: React.ComponentProps<"textarea"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "textarea";

  return (
    <Comp
      className={cn(
        "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  );
};

export { Textarea };