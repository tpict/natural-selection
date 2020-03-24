import {
  Reducer,
  Dispatch,
  useEffect,
  useRef,
  useMemo,
  useReducer,
} from "react";

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
  const prevStateRef = useRef(mergeNonUndefinedProperties(initialState, props));
  const propsRef = useRef(props);
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    propsRef.current = props;
    onStateChangeRef.current = onStateChange;
  }, [props, onStateChange]);

  const { current: reduce } = useRef<Reducer<State, Action>>((_, action) => {
    const { current: props } = propsRef;
    const { current: onStateChange } = onStateChangeRef;

    const prevState = prevStateRef.current;

    let nextState = reducer(prevState, action);
    if (nextState !== prevState) {
      // Only call this on state changes.
      onStateChange?.(nextState, action, prevState);

      // We need to merge props on top after the reducer is done in case it
      // overrode any of them, but we should only do this if the state
      // actually changed, otherwise no-op actions will trigger a render.
      nextState = mergeNonUndefinedProperties(nextState, props);
      if (shallowCompare(nextState, prevState)) {
        nextState = prevState;
      }
    }

    prevStateRef.current = nextState;
    return nextState;
  });

  const [innerState, dispatch] = useReducer(reduce, prevStateRef.current);

  // Redundant props merge so a render will be triggered after props change, even
  // without a corresponding action
  const state = useMemo(() => {
    const mergedState = mergeNonUndefinedProperties(innerState, props);
    prevStateRef.current = mergedState;
    return mergedState;
  }, [innerState, props]);

  return [state, dispatch];
};
