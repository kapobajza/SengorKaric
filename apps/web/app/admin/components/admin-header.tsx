import React from "react";
import type { ComponentProps } from "react";
import { MoonIcon, SunIcon } from "lucide-react";

import { SidebarTrigger } from "@/web/components/ui/sidebar";
import { cn } from "@/web/lib/utils";
import { Button } from "@/web/components/ui/button";
import { useMeQueryCached } from "@/web/query/user.query";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/web/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/web/components/ui/avatar";
import { useThemeSwitch } from "@/web/hooks/use-theme-switch";

function ProfileDropdown() {
  const { data, isLoading } = useMeQueryCached();
  const formRef = React.useRef<HTMLFormElement>(null);

  if (isLoading || !data) return null;

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={data.avatar ?? ""} alt="profile_image" />
            <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{data.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {data.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <form method="post" ref={formRef} action="/admin">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => {
              formRef.current?.requestSubmit();
            }}
          >
            Odjavi se
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function AdminHeader({
  className,
  ...otherProps
}: ComponentProps<"header">) {
  const [offset, setOffset] = React.useState(0);
  const { mutate: toggleTheme } = useThemeSwitch();

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    document.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "fixed right-0 z-10 flex h-11 w-[inherit] items-center justify-between gap-4 bg-background px-4 py-2 transition-[width] duration-150",
        offset > 10 && "shadow-[0_1px_0_0_rgb(0,0,0,0.05)]",
        className,
      )}
      {...otherProps}
    >
      <SidebarTrigger variant="outline" />
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={() => {
            toggleTheme();
          }}
        >
          <SunIcon className="transition-all dark:hidden" />
          <MoonIcon className="hidden transition-all dark:block" />
        </Button>
        <ProfileDropdown />
      </div>
    </header>
  );
}
