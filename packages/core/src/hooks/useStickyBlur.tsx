import React from "react";

export const useStickyBlur = (
  stickyElement: HTMLElement | null,
  callback?: (event: React.FocusEvent<HTMLInputElement>) => void,
) => (event: React.FocusEvent<HTMLInputElement>): void => {
  const { currentTarget, relatedTarget } = event;
  if (relatedTarget && stickyElement?.contains(relatedTarget as HTMLElement)) {
    (currentTarget as HTMLElement).focus();
    return;
  }

  callback?.(event);
};
