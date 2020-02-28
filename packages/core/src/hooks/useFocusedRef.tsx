import { useCallback } from "react";

import { useCallbackRef } from "./useCallbackRef";

export function useFocusedRef<OptionType>(
  focusedOption: OptionType,
): [
  HTMLDivElement | null,
  (
    option: OptionType,
  ) => { innerRef: (el: HTMLDivElement | null) => void } | undefined,
] {
  const focusedRef = useCallbackRef<HTMLDivElement>();

  return [
    focusedRef.current,
    useCallback(
      option => {
        if (option === focusedOption) {
          return { innerRef: focusedRef.callback };
        }

        return;
      },
      [focusedRef, focusedOption],
    ),
  ];
}
