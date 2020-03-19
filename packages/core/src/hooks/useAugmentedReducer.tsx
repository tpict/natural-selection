import { Reducer, Dispatch, useEffect, useRef, useReducer } from "react";

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

export type AugmentedInitAction = { type: "init" };
const isInitAction = (action: {
  type: string;
}): action is AugmentedInitAction => action.type === "init";

export type PropsUpdateAction<Props> = { type: "updateProps"; props: Props };
const isPropsUpdateAction = <Props extends unknown>(action: {
  type: string;
}): action is PropsUpdateAction<Props> => action.type === "updateProps";

export type AugmentedReducerCustom<State, Action, Props> = (
  state: State,
  action: Action | PropsUpdateAction<Props> | AugmentedInitAction,
  reducer: Reducer<
    State,
    Action | PropsUpdateAction<Props> | AugmentedInitAction
  >,
) => State;

export type AugmentedReducerChangeHandler<State, Action, Props> = (
  state: State,
  action: Action | PropsUpdateAction<Props> | AugmentedInitAction,
  prevState: State,
) => void;

export const useAugmentedReducer = <
  State extends {},
  Action extends { type: string },
  Props = Partial<State>
>(
  reducer: Reducer<State, Action>,
  initialState: State,
  props: Props = {} as Props,
  customReducer?: AugmentedReducerCustom<State, Action, Props>,
  onStateChange?: AugmentedReducerChangeHandler<State, Action, Props>,
): [State, Dispatch<Action | PropsUpdateAction<Props>>] => {
  const propsRef = useRef(props);
  const customReducerRef = useRef(customReducer);
  const onStateChangeRef = useRef(onStateChange);

  // Wrap the given reducer with handlers for the "updateProps" and "init"
  // actions.
  const { current: propsUpdateReducer } = useRef<
    Reducer<State, Action | PropsUpdateAction<Props> | AugmentedInitAction>
  >((prevState, action) => {
    if (isPropsUpdateAction(action)) {
      return mergeNonUndefinedProperties(prevState, action.props);
    }

    if (isInitAction(action)) {
      return prevState;
    }

    return reducer(prevState, action);
  });

  const { current: reduce } = useRef<
    Reducer<State, Action | PropsUpdateAction<Props> | AugmentedInitAction>
  >((prevState, action) => {
    const { current: props } = propsRef;
    const { current: customReducer } = customReducerRef;
    const { current: onStateChange } = onStateChangeRef;

    let nextState: State;

    if (customReducer) {
      nextState = customReducer(prevState, action, propsUpdateReducer);
    } else {
      nextState = propsUpdateReducer(prevState, action);
    }

    if (nextState !== prevState) {
      // Only call this on state changes.
      onStateChange?.(nextState, action, prevState);

      // We need to merge props on top after the reducer is done in case it
      // overrode any of them, but we should only do this if the state
      // actually changed, otherwise no-op actions will trigger a render.
      nextState = mergeNonUndefinedProperties(nextState, props);
      if (shallowCompare(nextState, prevState)) {
        return prevState;
      }
    }

    return nextState;
  });

  let mergedInitialState = mergeNonUndefinedProperties(initialState, props);

  const hasInitializedRef = useRef(false);
  if (!hasInitializedRef.current) {
    customReducer &&
      (mergedInitialState = customReducer(
        mergedInitialState,
        { type: "init" },
        propsUpdateReducer,
      ));
    hasInitializedRef.current = true;
  }

  const [state, dispatch] = useReducer(reduce, mergedInitialState);

  useEffect(() => {
    propsRef.current = props;
    dispatch({ type: "updateProps", props });
  }, [props]);

  useEffect(() => {
    customReducerRef.current = customReducer;
    onStateChangeRef.current = onStateChange;
  }, [customReducer, onStateChange]);

  return [state, dispatch];
};
