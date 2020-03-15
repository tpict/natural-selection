import { useCallback, useEffect, useRef } from "react";

export const useScrollToFocused = (
  focusedRef: HTMLElement | null,
): (() => void) => {
  const shouldScroll = useRef<boolean>(false);

  useEffect(() => {
    if (!focusedRef || !shouldScroll.current) {
      return;
    }

    shouldScroll.current = false;
    focusedRef.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [focusedRef]);

  return useCallback((): void => {
    shouldScroll.current = true;
  }, []);
};
