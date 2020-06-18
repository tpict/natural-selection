import { useRef, useEffect } from "react";

export const useScrollToFocused = (menuEl: HTMLElement | null): void => {
  const lastHoveredElement = useRef<HTMLElement | null>(null);

  const mutationObserverRef = useRef<MutationObserver>(
    new MutationObserver(mutationsList => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "aria-selected"
        ) {
          const target = mutation.target as HTMLElement;

          if (target.getAttribute?.("aria-selected") === "true") {
            if (lastHoveredElement.current === target) {
              return;
            }

            target.scrollIntoView({
              block: "nearest",
            });

            break;
          }
        }
      }

      lastHoveredElement.current = null;
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
      lastHoveredElement.current = event.target as HTMLElement;
    };

    menuEl.addEventListener("mouseover", mouseHandler);

    return () => {
      menuEl.removeEventListener("mouseover", mouseHandler);
      mutationObserver.disconnect();
    };
  }, [menuEl]);
};
