import React from "react";

import { noop } from "./react-select";

export const simpleMemo: <T>(fn: T) => T = React.memo;

export const preventDefault = (event: React.SyntheticEvent): void =>
  event.preventDefault();

export const defaultKeyDownHandler = <T extends object>(
  event: React.KeyboardEvent,
  {
    focused = null,
    isMenuOpen = true,
  }: { focused?: T | null; isMenuOpen?: boolean },
  {
    focusRelativeOption = noop,
    handleValueChange = noop,
    handleInputChange = noop,
    setMenuOpen = noop,
    scrollToFocusedOnUpdate = noop,
  }: {
    focusRelativeOption?: (direction: number) => void;
    handleValueChange?: (option: T | null) => void;
    handleInputChange?: (input: string) => void;
    setMenuOpen?: (isOpen: boolean) => void;
    scrollToFocusedOnUpdate?: () => void;
  },
): void => {
  switch (event.key) {
    case "ArrowDown":
      scrollToFocusedOnUpdate();
      focusRelativeOption(1);
      break;
    case "ArrowUp":
      scrollToFocusedOnUpdate();
      focusRelativeOption(-1);
      break;
    case " ":
      if ((event.target as HTMLInputElement).value) {
        return;
      }

      if (!isMenuOpen) {
        setMenuOpen(true);
      } else if (focused) {
        handleValueChange(focused);
      }

      break;
    case "Enter":
      if (isMenuOpen && focused) {
        handleValueChange(focused);
        break;
      }

      return;
    case "Escape":
      handleInputChange("");
      setMenuOpen(false);
      break;
    default:
      return;
  }

  event.preventDefault();
};
