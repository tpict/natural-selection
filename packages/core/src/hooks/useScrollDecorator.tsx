import { Dispatch, useEffect, useRef } from "react";

import { FocusOptionAction, RelativeFocusAction } from "../reducers";

const isFocusAction = <OptionType extends unknown>(
  action: FocusOptionAction<OptionType> | RelativeFocusAction | unknown,
): action is FocusOptionAction<OptionType> | RelativeFocusAction => {
  const asAction = action as { type: string };
  return asAction.type === "focusOption" || asAction.type === "relativeFocus";
};

export const useScrollDecorator = <
  OptionType extends unknown,
  Action extends FocusOptionAction<OptionType> | RelativeFocusAction | unknown
>(
  dispatch: Dispatch<Action>,
  focusedOptionId: string | null,
): Dispatch<Action> => {
  const blockMouseEventsRef = useRef(false);
  const shouldScrollOnUpdateRef = useRef(false);

  useEffect(() => {
    const handler = (): void => {
      blockMouseEventsRef.current = false;
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, []);

  useEffect(() => {
    if (!focusedOptionId || !shouldScrollOnUpdateRef.current) {
      return;
    }

    shouldScrollOnUpdateRef.current = false;

    const focusedNode = document.getElementById(focusedOptionId);
    if (focusedNode) {
      focusedNode.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [focusedOptionId]);

  const dispatchRef = useRef<Dispatch<Action>>(action => {
    if (isFocusAction(action)) {
      if (action.source === "keyboard") {
        blockMouseEventsRef.current = true;
        shouldScrollOnUpdateRef.current = true;
      }

      if (action.source === "mouse" && blockMouseEventsRef.current) {
        return;
      }
    }

    dispatch(action);
  });

  return dispatchRef.current;
};
