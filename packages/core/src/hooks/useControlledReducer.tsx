import { Reducer, Dispatch, useEffect, useRef, useState } from "react";

import { mergeNonUndefinedProperties } from "../utils";

const defaultProps = {};

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

export const useControlledReducer = <
  State extends object,
  Action,
  InitialState extends State = State
>(
  reducer: Reducer<State, Action>,
  initialState: InitialState,
  props: Partial<State> = defaultProps,
  onStateChange?: (state: State, action: Action, prevState: State) => void,
): [State, Dispatch<Action>] => {
  const propsRef = useRef(props);
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    propsRef.current = props;
    onStateChangeRef.current = onStateChange;
  }, [props, onStateChange]);

  const [state, setState] = useState<State>(
    mergeNonUndefinedProperties(initialState, props),
  );

  const reducerRef = useRef<Reducer<State, Action>>((prevState, action) => {
    const { current: props } = propsRef;
    const { current: onStateChange } = onStateChangeRef;

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

    return nextState;
  });

  useEffect(() => {
    setState(state => mergeNonUndefinedProperties(state, props));
  }, [props]);

  const dispatch = useRef<Dispatch<Action>>(action => {
    setState(state => reducerRef.current(state, action));
  }).current;

  return [state, dispatch];
};
