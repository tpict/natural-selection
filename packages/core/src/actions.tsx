import { Dispatch } from "react";

import { RelativeFocusAction } from "./reducers";

export const createKeyDownHandler = (
  dispatch: Dispatch<
    | { type: "openMenu" }
    | { type: "closeMenu" }
    | { type: "selectFocused" }
    | RelativeFocusAction
    | { type: "clearLast" }
  >,
  state: {
    inputValue: string;
    isMenuOpen: boolean;
  },
) => (event: React.KeyboardEvent): void => {
  switch (event.key) {
    case "ArrowDown":
      dispatch({
        type: "relativeFocus",
        direction: 1,
      });
      break;
    case "ArrowUp":
      dispatch({
        type: "relativeFocus",
        direction: -1,
      });
      break;
    case " ":
      if (state.inputValue) {
        return;
      }

      if (!state.isMenuOpen) {
        dispatch({ type: "openMenu" });
      } else {
        dispatch({
          type: "selectFocused",
        });
      }

      break;
    case "Enter":
      if (state.isMenuOpen) {
        dispatch({
          type: "selectFocused",
        });
        break;
      }

      return;
    case "Escape":
      dispatch({ type: "closeMenu" });
      break;
    case "Backspace":
      if (state.inputValue) {
        return;
      }

      dispatch({ type: "clearLast" });
      break;
    default:
      return;
  }

  event.preventDefault();
};
