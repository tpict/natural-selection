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
  customReducer?: (state: State, action: Action) => State,
  onStateChange?: (state: State) => void,
): [State, Dispatch<Action>] => {
  const reduce: Reducer<State, Action> = useCallback(
    (prevState, action) => {
      const stateWithProps = mergeNonUndefinedProperties(
        prevState,
        props ?? {},
      );

      let nextState: State;
      if (customReducer) {
        nextState = customReducer(stateWithProps, action);
      } else {
        nextState = reducer(stateWithProps, action);
      }

      onStateChange?.(nextState);
      // TODO: Do a shallow comparison against old state and return that if we
      // have a match - it'll save a render in the controlled props scenario
      return mergeNonUndefinedProperties(nextState, props ?? {});
    },
    [customReducer, onStateChange, reducer, props],
  );

  const [innerState, dispatch] = useReducer(reduce, initialState);

  const state = useMemo(
    () => mergeNonUndefinedProperties(innerState, props ?? {}),
    [innerState, props],
  );

  return [state, dispatch];
};
