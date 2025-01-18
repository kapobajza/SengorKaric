import { useMutation } from "@tanstack/react-query";
import type { DefaultError, UseMutationResult } from "@tanstack/react-query";

import { useToast } from "@/web/hooks/use-toast";
import { constructErrorMessage } from "@/web/lib/error";

import type { UseMutationOptions } from "./types";

export default function useCustomMutation<
  TData = unknown,
  TError = DefaultError,
  TVariables = void,
  TContext = unknown,
>(
  options: UseMutationOptions<TData, TError, TVariables, TContext>,
): UseMutationResult<TData, TError, TVariables, TContext> {
  const { showToast = true, onError, ...rest } = options;
  const { toast } = useToast();

  return useMutation({
    ...rest,
    onError(error, variables, context) {
      if (onError) {
        onError(error, variables, context);
      }

      if (showToast) {
        toast({
          variant: "destructive",
          title: "Dogodila se greška",
          description: constructErrorMessage(error as Error),
        });
      }
    },
  });
}
