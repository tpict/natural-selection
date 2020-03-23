import { useRef, useEffect } from "react";

import { usePrevious } from "./usePrevious";

export const useScrollToFocused = (
  menuEl: HTMLElement | null,
): (() => void) => {
  const scrollOnUpdateRef = useRef(false);
  const didJustScrollRef = usePrevious(scrollOnUpdateRef.current);

  const mutationObserverRef = useRef<MutationObserver>(
    new MutationObserver(mutationsList => {
      if (!scrollOnUpdateRef.current) {
        return;
      }

      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-selected"
        ) {
          const target = mutation.target as HTMLElement;

          if (target.getAttribute?.("aria-selected") === "true") {
            target.scrollIntoView({
              block: "nearest",
              behavior: "smooth",
            });

            break;
          }
        }
      }

      scrollOnUpdateRef.current = false;
    }),
  );

  useEffect(() => {
    const { current: mutationObserver } = mutationObserverRef;

    if (!menuEl) {
      mutationObserver.disconnect();
      return;
    }

    mutationObserver.observe(menuEl, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    const mouseHandler = (event: MouseEvent): void => {
      if (didJustScrollRef.current) {
        event.stopPropagation();
        event.preventDefault();
      }
    };

    menuEl.addEventListener("mouseover", mouseHandler);

    return () => {
      menuEl.removeEventListener("mouseover", mouseHandler);
      mutationObserver.disconnect();
    };
    // usePrevious returns a ref
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuEl]);

  return useRef(() => (scrollOnUpdateRef.current = true)).current;
};
