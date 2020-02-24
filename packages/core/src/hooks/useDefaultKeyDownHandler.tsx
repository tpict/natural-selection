import { useCallback } from "react";

import { noop } from "../utils";

export const useDefaultKeyDownHandler = <T extends object>(
  options: T[],
  {
    focused,
    isMenuOpen,
    inputValue,
  }: { focused: T | null; isMenuOpen?: boolean; inputValue?: string },
  {
    handleFocusChange = noop,
    handleValueChange = noop,
    handleInputChange = noop,
    setMenuOpen = noop,
    scrollToFocusedOnUpdate = noop,
  }: {
    handleFocusChange?: (option: T | null) => void;
    handleValueChange?: (option: T | null) => void;
    handleInputChange?: (input: string) => void;
    setMenuOpen?: (isOpen: boolean) => void;
    scrollToFocusedOnUpdate?: () => void;
  },
): ((event: React.KeyboardEvent) => void) =>
  useCallback(
    event => {
      let index: number;

      switch (event.key) {
        case "ArrowDown":
          index = focused
            ? Math.min(options.indexOf(focused) + 1, options.length - 1)
            : 0;
          scrollToFocusedOnUpdate();
          handleFocusChange(options[index]);
          break;
        case "ArrowUp":
          index = focused ? Math.max(options.indexOf(focused) - 1, 0) : 0;
          scrollToFocusedOnUpdate();
          handleFocusChange(options[index]);
          break;
        case " ":
          if (inputValue) {
            return;
          }

          if (!isMenuOpen) {
            setMenuOpen(true);
          }

          if (focused) {
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
    },
    [
      focused,
      handleFocusChange,
      handleInputChange,
      handleValueChange,
      inputValue,
      isMenuOpen,
      options,
      setMenuOpen,
      scrollToFocusedOnUpdate,
    ],
  );
