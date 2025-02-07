import { useNavigation } from "react-router";
import { useRef, useState, useEffect } from "react";
import * as Portal from "@radix-ui/react-portal";

import { cn } from "@/web/lib/utils";

export function GlobalProgressIndicator() {
  const navigation = useNavigation();
  const active = navigation.state !== "idle";

  const ref = useRef<HTMLDivElement>(null);
  const [animationComplete, setAnimationComplete] = useState(true);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    if (active) {
      setAnimationComplete(false);
    }

    let timeout: NodeJS.Timeout;

    void Promise.allSettled(
      ref.current.getAnimations().map(({ finished }) => finished),
    ).then(() => {
      if (!active) {
        timeout = setTimeout(() => {
          setAnimationComplete(true);
        }, 150);
      }
    });

    return () => {
      clearTimeout(timeout);
    };
  }, [active]);

  return (
    <Portal.Root asChild>
      <div
        role="progressbar"
        aria-hidden={!active}
        aria-valuetext={active ? "Loading" : undefined}
        className="fixed inset-x-0 left-0 top-0 z-[999] h-1 animate-pulse"
      >
        <div
          ref={ref}
          className={cn(
            "h-full bg-gradient-to-r from-primary to-primary-700 transition-all duration-500 ease-in-out",
            navigation.state === "idle" &&
              animationComplete &&
              "w-0 opacity-0 transition-none",
            navigation.state === "submitting" && "w-4/12",
            navigation.state === "loading" && "w-10/12",
            navigation.state === "idle" && !animationComplete && "w-full",
          )}
        />
      </div>
    </Portal.Root>
  );
}
