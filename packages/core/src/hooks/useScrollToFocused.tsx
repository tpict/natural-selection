import { useEffect, useRef } from "react";

import { scrollIntoView } from "../react-select/utils";

// TODO: Keep track of wheel evsnts, don't futz with scroll position during
// them
export const useScrollToFocused = (
  menuRef: HTMLElement | null,
  focusedRef: HTMLElement | null,
): void => {
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!menuRef) {
      return;
    }

    observerRef.current = new window.IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // NOTE: It seems that an element that's precisely outside the bounds
          // of an element with overflow-y: auto; can still trigger mouseOver
          // events if the user hovers at the very last pixel. Huh?
          // Work around is to under-scroll by 1px but I would much rather
          // figure out how to prevent the focus event from happening at the
          // source.
          scrollIntoView(menuRef, entry.target as HTMLElement, -1, true);
        }
      },
      { root: menuRef, threshold: 1.0 },
    );
  }, [menuRef]);

  useEffect(() => {
    if (!focusedRef || !observerRef.current) {
      return;
    }

    const { current: observer } = observerRef;
    observer.observe(focusedRef);
    return () => observer.disconnect();
  }, [focusedRef]);
};
