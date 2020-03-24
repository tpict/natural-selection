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

// https://stackoverflow.com/a/52323412
const shallowCompare = <Obj1 extends object, Obj2 extends object>(
  obj1: Obj1,
  obj2: Obj2,
): boolean =>
  Object.keys(obj1).length === Object.keys(obj2).length &&
  Object.keys(obj1).every(
    key =>
      obj2.hasOwnProperty(key) &&
      (obj1[key as keyof Obj1] as unknown) ===
        (obj2[key as keyof Obj2] as unknown),
  );

export const useAugmentedReducer = <
  State extends object,
  Action,
  Props = Partial<State>
>(
  reducer: Reducer<State, Action>,
  initialState: State,
  props: Props = {} as Props,
  onStateChange?: (state: State, action: Action, prevState: State) => void,
): [State, Dispatch<Action>] => {
  const propsRef = useRef(props);
  const previousPropsRef = usePrevious(props);
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    propsRef.current = props;
    onStateChangeRef.current = onStateChange;
  }, [props, onStateChange]);

  const { current: reduce } = useRef<Reducer<State, Action>>(
    (prevState, action) => {
      const { current: props } = propsRef;
      const { current: previousProps } = previousPropsRef;
      const { current: onStateChange } = onStateChangeRef;

      // Only merge props on top if they've changed since the last dispatch,
      // otherwise no-op actions will trigger a render.
      let prevStateWithProps = prevState;
      if (props !== previousProps) {
        prevStateWithProps = mergeNonUndefinedProperties(prevState, props);
      }

      let nextState = reducer(prevStateWithProps, action);

      if (nextState !== prevStateWithProps) {
        // Only call this on state changes.
        onStateChange?.(nextState, action, prevStateWithProps);

        // We need to merge props on top after the reducer is done in case it
        // overrode any of them, but we should only do this if the state
        // actually changed, otherwise no-op actions will trigger a render.
        nextState = mergeNonUndefinedProperties(nextState, props);
        if (shallowCompare(nextState, prevState)) {
          return prevState;
        }
      }

      return nextState;
    },
  );

  const [innerState, dispatch] = useReducer(
    reduce,
    mergeNonUndefinedProperties(initialState, props),
  );

  // Redundant props merge so a render will be triggered after props change, even
  // without a corresponding action
  const state = useMemo(() => {
    return mergeNonUndefinedProperties(innerState, props);
  }, [innerState, props]);

  return [state, dispatch];
};
