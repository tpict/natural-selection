import React from "react";

export const useCloseOnBlur = (
  menuRef: React.MutableRefObject<HTMLElement | null>,
  handleClose: () => void,
) => ({ currentTarget, relatedTarget }: React.FocusEvent): void => {
  if (
    relatedTarget &&
    menuRef.current?.contains(relatedTarget as HTMLElement)
  ) {
    (currentTarget as HTMLElement).focus();
    return;
  }

  handleClose();
};
