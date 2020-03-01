import React from "react";

export const useStickyBlur = (
  stickyElement: HTMLElement | null,
  callback?: (event: React.FocusEvent<HTMLInputElement>) => void,
) => (event: React.FocusEvent<HTMLInputElement>): void => {
  const { currentTarget, relatedTarget } = event;
  if (relatedTarget && stickyElement) {
    if (stickyElement.contains) {
      if (stickyElement.contains(relatedTarget as HTMLElement)) {
        (currentTarget as HTMLElement).focus();
        return;
      }
    }

    console.warn(
      'stickyElement doesn\'t have the "contains" property, please find out why!',
      stickyElement,
    );
  }

  callback?.(event);
};
