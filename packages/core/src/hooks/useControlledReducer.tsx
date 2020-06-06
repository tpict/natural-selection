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
  const [state, setState] = useState<State>(
    mergeNonUndefinedProperties(initialState, props),
  );

  // Mirror props/state into refs so we can reference them in dependencies of
  // "dispatch" without requiring re-renders.
  // The idea is to make "dispatch" a static reference just like vanilla React.
  const stateRef = useRef(state);
  const propsRef = useRef(props);
  const onStateChangeRef = useRef(onStateChange);

  // Keep these refs in sync with the corresponding state/props
  useEffect(() => {
    propsRef.current = props;
    onStateChangeRef.current = onStateChange;
  }, [props, onStateChange]);

  // Bind arguments to onStateChange so it can be called after state updates
  // without having to bring those arguments into a higher scope.
  //
  // After calling, the "current" property should be set to undefined so it's
  // not called again.
  const afterStateChangeCallbackRef = useRef<() => void | undefined>();

  const reducerRef = useRef<Reducer<State, Action>>((prevState, action) => {
    const { current: props } = propsRef;

    let nextState = reducer(prevState, action);
    if (nextState !== prevState) {
      // need to declare a new variable here since nextState may be reassigned
      // TODO remove the "let" statement so this isn't an issue
      const unmergedNextState = nextState;

      afterStateChangeCallbackRef.current = () =>
        onStateChangeRef.current?.(unmergedNextState, action, prevState);

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

  // Merge prop changes into state.
  const skipPropMergeRef = useRef(true);
  useEffect(() => {
    if (skipPropMergeRef.current) {
      // No need to do this on mount
      skipPropMergeRef.current = false;
      return;
    }

    setState(state => {
      const nextState = mergeNonUndefinedProperties(state, props);
      stateRef.current = nextState;
      return nextState;
    });
  }, [props]);

  // Call onStateChange after state updates.
  useEffect(() => {
    afterStateChangeCallbackRef.current?.();
    afterStateChangeCallbackRef.current = undefined;
  }, [state]);

  const dispatch = useRef<Dispatch<Action>>(action => {
    const prevState = stateRef.current;
    const nextState = reducerRef.current(prevState, action);

    stateRef.current = nextState;
    setState(nextState);

    // If state is unchanged, we need to call onStateChange manually as the
    // effect above won't be triggered.
    if (prevState === nextState) {
      afterStateChangeCallbackRef.current?.();
      afterStateChangeCallbackRef.current = undefined;
    }
  }).current;

  return [state, dispatch];
};
