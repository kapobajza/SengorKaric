import * as Toolbar from "@radix-ui/react-toolbar";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/web/components/ui/tooltip";
import { Button } from "@/web/components/ui/button";
import { cn } from "@/web/lib/utils";

export type RichTextToolbarButtonProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  name: string;
  label: string;
  isActive?: boolean;
  handleClick: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
};

export function RichTextToolbarButton({
  icon: Icon,
  name,
  label,
  isActive,
  handleClick,
  disabled,
}: RichTextToolbarButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Toolbar.ToggleItem
          aria-disabled={disabled}
          disabled={disabled}
          value={name}
          data-state={isActive ? "on" : "off"}
          onMouseDown={handleClick}
          aria-label={label}
          asChild
        >
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-7 w-7",
              isActive &&
                "bg-primary-600 text-white hover:bg-primary-600 hover:text-white",
            )}
            aria-label={label}
          >
            <Icon className={cn("h-4 w-4")} />
          </Button>
        </Toolbar.ToggleItem>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
}
