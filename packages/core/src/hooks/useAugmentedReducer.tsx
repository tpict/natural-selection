import {
  Reducer,
  Dispatch,
  useEffect,
  useRef,
  useMemo,
  useReducer,
} from "react";

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
      const { current: customReducer } = customReducerRef;
      const { current: onStateChange } = onStateChangeRef;

      const prevStateWithProps = mergeNonUndefinedProperties(
        prevState,
        props ?? {},
      );

      let nextState: State;
      if (customReducer) {
        nextState = customReducer(prevStateWithProps, action, reducer);
      } else {
        nextState = reducer(prevStateWithProps, action);
      }

      onStateChange?.(nextState, action, prevStateWithProps);
      // TODO: Do a shallow comparison against old state and return that if we
      // have a match - it'll save a render in the controlled props scenario
      return mergeNonUndefinedProperties(nextState, props ?? {});
    },
  );

  const [innerState, dispatch] = useReducer(reduce, initialState);

  const state = useMemo(
    () => mergeNonUndefinedProperties(innerState, props ?? {}),
    [innerState, props],
  );

  return [state, dispatch];
};
