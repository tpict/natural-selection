import React from "react";

export const useCloseOnBlur = (
  inputRef: React.MutableRefObject<HTMLElement | null>,
  menuRef: React.MutableRefObject<HTMLElement | null>,
  handleClose: () => void,
) => ({ relatedTarget }: React.FocusEvent): void => {
  if (
    relatedTarget &&
    menuRef.current?.contains(relatedTarget as HTMLElement)
  ) {
    inputRef.current?.focus();
    return;
  }

  handleClose();
};
