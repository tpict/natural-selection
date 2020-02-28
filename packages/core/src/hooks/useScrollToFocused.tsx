import { useCallback, useEffect, useRef } from "react";

import { scrollIntoView } from "../react-select/utils";

export const useScrollToFocused = (
  menuRef: HTMLElement | null,
  focusedRef: HTMLElement | null,
): (() => void) => {
  const shouldScroll = useRef<boolean>(false);

  useEffect(() => {
    if (!menuRef || !focusedRef || !shouldScroll.current) {
      return;
    }

    shouldScroll.current = false;
    scrollIntoView(menuRef, focusedRef);
    // refs aren't an effect dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuRef, focusedRef]);

  return useCallback((): void => {
    shouldScroll.current = true;
  }, []);
};
