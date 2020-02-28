import { useEffect, useRef } from "react";

enum ScrollState {
  Top,
  Bottom,
  Neither,
}

// NOTE This behavior is provided by
// https://developer.mozilla.org/en-US/docs/Web/CSS/overscroll-behavior
// Waiting on Safari support
export const useScrollCaptor = (node: HTMLElement | null): void => {
  const scrollState = useRef<ScrollState>(ScrollState.Neither);

  useEffect(() => {
    if (!node) {
      return;
    }

    const cancelScrollEvent = (event: WheelEvent): void => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onWheel = (event: WheelEvent): void => {
      const { scrollTop, scrollHeight, clientHeight } = node;
      const availableScroll = scrollHeight - clientHeight - scrollTop;

      const magnitude = Math.abs(event.deltaY);
      const isScrollingDown = event.deltaY > 0;

      if (
        (scrollState.current === ScrollState.Bottom &&
          availableScroll > magnitude) ||
        (scrollState.current === ScrollState.Top && isScrollingDown)
      ) {
        scrollState.current = ScrollState.Neither;
      }

      if (isScrollingDown && magnitude > availableScroll) {
        node.scrollTop = scrollHeight;
        cancelScrollEvent(event);
        scrollState.current = ScrollState.Bottom;
      } else if (!isScrollingDown && magnitude > scrollTop) {
        node.scrollTop = 0;
        cancelScrollEvent(event);
        scrollState.current = ScrollState.Top;
      }
    };

    node.addEventListener("wheel", onWheel);

    return () => node.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [node]);
};
