import { Reducer, Dispatch, useEffect, useRef, useReducer } from "react";

import { usePrevious } from "./usePrevious";
import { mergeNonUndefinedProperties } from "../utils";

type PropsUpdateAction<Props> = { type: "propsUpdate"; props: Props };
const isPropsUpdateAction = <Props extends unknown>(action: {
  type: string;
}): action is PropsUpdateAction<Props> => action.type === "propsUpdate";

export const useAugmentedReducer = <
  State extends object,
  Action extends { type: string },
  Props = Partial<State>
>(
  reducer: Reducer<State, Action>,
  initialState: State,
  // TODO: don't know why this union is required, {} should fulfill Props
  props: Props | {} = {},
  customReducer?: (
    state: State,
    action: Action,
    reducer: Reducer<State, Action>,
  ) => State,
  onStateChange?: (state: State, action: Action, prevState: State) => void,
): [State, Dispatch<Action | PropsUpdateAction<Props>>] => {
  const propsRef = useRef(props);
  const previousPropsRef = usePrevious(props);
  const customReducerRef = useRef(customReducer);
  const onStateChangeRef = useRef(onStateChange);

  useEffect(() => {
    propsRef.current = props;
    customReducerRef.current = customReducer;
    onStateChangeRef.current = onStateChange;
  }, [props, customReducer, onStateChange]);

  const { current: reduce } = useRef<
    Reducer<State, Action | PropsUpdateAction<Props>>
  >((prevState, action) => {
    if (isPropsUpdateAction(action)) {
      return { ...prevState, ...action.props };
    }

    const { current: props } = propsRef;
    const { current: previousProps } = previousPropsRef;
    const { current: customReducer } = customReducerRef;
    const { current: onStateChange } = onStateChangeRef;

    // Only merge props on top if they've changed since the last dispatch,
    // otherwise no-op actions will trigger a render.
    let prevStateWithProps = prevState;
    if (props !== previousProps) {
      prevStateWithProps = mergeNonUndefinedProperties(prevState, props);
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
      return mergeNonUndefinedProperties(nextState, props);
    }

    return nextState;
  });

  return useReducer(reduce, mergeNonUndefinedProperties(initialState, props));
};
