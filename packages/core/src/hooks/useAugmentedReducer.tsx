import {
  Reducer,
  Dispatch,
  useEffect,
  useRef,
  useMemo,
  useReducer,
} from "react";

import { usePrevious } from "./usePrevious";
import { mergeNonUndefinedProperties } from "../utils";

export const useAugmentedReducer = <
  State extends object,
  Action,
  Props = Partial<State>
>(
  reducer: Reducer<State, Action>,
  initialState: State,
  props?: Props,
  customReducer?: (
    state: State,
    action: Action,
    reducer: Reducer<State, Action>,
  ) => State,
  onStateChange?: (state: State, action: Action, prevState: State) => void,
): [State, Dispatch<Action>] => {
  const propsRef = useRef(props);
  const previousPropsRef = usePrevious(props);
  const customReducerRef = useRef(customReducer);
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    propsRef.current = props;
    customReducerRef.current = customReducer;
    onStateChangeRef.current = onStateChange;
  }, [props, customReducer, onStateChange]);

  const { current: reduce } = useRef<Reducer<State, Action>>(
    (prevState, action) => {
      const { current: props } = propsRef;
      const { current: previousProps } = previousPropsRef;
      const { current: customReducer } = customReducerRef;
      const { current: onStateChange } = onStateChangeRef;

      // Only merge props on top if they've changed since the last dispatch,
      // otherwise no-op actions will trigger a render.
      let prevStateWithProps = prevState;
      if (props !== previousProps) {
        prevStateWithProps = mergeNonUndefinedProperties(
          prevState,
          props ?? {},
        );
      }

      let nextState: State;
      if (customReducer) {
        nextState = customReducer(prevStateWithProps, action, reducer);
      } else {
        nextState = reducer(prevStateWithProps, action);
      }

      if (nextState !== prevStateWithProps) {
        // Only call this on state changes.
        onStateChange?.(nextState, action, prevStateWithProps);

        // We need to merge props on top after the reducer is done in case it
        // overrode any of them, but we should only do this if the state
        // actually changed, otherwise no-op actions will trigger a render.
        return mergeNonUndefinedProperties(nextState, props ?? {});
      }

      return nextState;
    },
  );

  const [innerState, dispatch] = useReducer(reduce, {
    ...initialState,
    ...props,
  });

  const state = useMemo(() => {
    return mergeNonUndefinedProperties(innerState, props ?? {});
  }, [innerState, props]);

  return [state, dispatch];
};
