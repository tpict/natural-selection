import { Reducer, Dispatch, useMemo, useReducer, useCallback } from "react";

import { mergeNonUndefinedProperties } from "../utils";

export const useAugmentedReducer = <
  State extends object,
  Action,
  Props = Partial<State>
>(
  reducer: Reducer<State, Action>,
  initialState: State,
  props?: Props,
  onChange?: (state: State, action: Action) => void,
): [State, Dispatch<Action>] => {
  const reduce: Reducer<State, Action> = useCallback(
    (prevState, action) => {
      const state = mergeNonUndefinedProperties(prevState, props ?? {});

      const overrideState = onChange?.(state, action);
      if (overrideState) {
        return overrideState;
      }

      return reducer(state, action);
    },
    [onChange, reducer, props],
  );

  const [innerState, dispatch] = useReducer(reduce, initialState);

  const state = useMemo(
    () => mergeNonUndefinedProperties(innerState, props ?? {}),
    [innerState, props],
  );

  return [state, dispatch];
};
