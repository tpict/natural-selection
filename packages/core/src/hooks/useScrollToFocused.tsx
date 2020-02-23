import React, { useCallback, useEffect, useRef } from "react";

import { scrollIntoView } from "../react-select/utils";

export const useScrollToFocused = <T extends unknown>(
  isMenuOpen: boolean,
  focusedOption: T,
  menuRef: React.MutableRefObject<HTMLElement | null>,
  focusedRef: React.MutableRefObject<HTMLElement | null>,
): (() => void) => {
  const shouldScroll = useRef<boolean>(false);

  useEffect(() => {
    if (
      !isMenuOpen ||
      !menuRef.current ||
      !focusedRef.current ||
      !shouldScroll.current
    ) {
      return;
    }

    shouldScroll.current = false;
    scrollIntoView(menuRef.current, focusedRef.current);
    // refs aren't an effect dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMenuOpen, focusedOption]);

  return useCallback((): void => {
    shouldScroll.current = true;
  }, []);
};
