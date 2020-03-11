import React, { Reducer, useMemo, useCallback, useRef } from "react";

import {
  useCallbackRef,
  useFocusedRef,
  useScrollCaptor,
  useScrollToFocused,
  useAugmentedReducer,
  createKeyDownHandler,
  selectReducer,
  SelectState,
  SelectAction,
} from "@natural-selection/core";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";
import { filteredOptionsSelector, focusedOptionSelector } from "./selectors";

type SingleSelectProps<T> = {
  "aria-label"?: string;
  options: T[];
  value?: T | null;
  customReducer?: (state: State<T>, action: SelectAction<T>) => State<T>;
  onStateChange?: (state: State<T>, action: SelectAction<T>) => void;
};

type State<T> = SelectState & {
  options: T[];
  value: T | null;
};

export const SingleSelect = <
  T extends { value: string; label: string; isDisabled?: boolean }
>({
  options,
  value,
  customReducer,
  onStateChange,
  ...rest
}: SingleSelectProps<T>): React.ReactElement => {
  const { current: reducer } = useRef<Reducer<State<T>, SelectAction<T>>>(
    (state, action) => {
      switch (action.type) {
        case "selectOption":
          state = {
            ...state,
            value: action.option,
          };
          break;
        case "selectFocused":
          state = {
            ...state,
            value: filteredOptionsSelector(state)[state.focusedIndex],
          };
          break;
        case "clearLast":
          state = { ...state, value: null };
          break;
      }

      return selectReducer(state, action, {
        visibleOptionsSelector: filteredOptionsSelector,
      });
    },
  );

  const [state, dispatch] = useAugmentedReducer(
    reducer,
    {
      isMenuOpen: false,
      inputValue: "",
      focusedIndex: 0,
      value: null,
      options: [],
    },
    useMemo(() => ({ value, options }), [value, options]),
    customReducer,
    onStateChange,
  );

  const menuRef = useCallbackRef<HTMLDivElement>();
  useScrollCaptor(menuRef.current);
  const placementStyles = useMenuPlacementStyles(menuRef.current);
  const [focusedRef, handleFocusedRef] = useFocusedRef(
    focusedOptionSelector(state),
  );
  useScrollToFocused(menuRef.current, focusedRef);

  const handleKeyDown = createKeyDownHandler(dispatch, state);

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        value={state.inputValue}
        aria-label={rest["aria-label"]}
        onMouseDown={() => dispatch({ type: "toggleMenu" })}
        onInputChange={value => dispatch({ type: "textInput", value })}
        menuRef={menuRef.current}
        onBlur={useCallback(() => dispatch({ type: "closeMenu" }), [dispatch])}
      >
        {!state.inputValue && state.value?.label}
        {!state.inputValue && !state.value && (
          <Placeholder>Pick an option</Placeholder>
        )}
      </Control>

      {state.isMenuOpen && (
        <Menu ref={menuRef.callback} css={placementStyles}>
          {filteredOptionsSelector(state).map(option => (
            <Option
              key={option.value}
              option={option}
              isActive={state.value?.value === option.value}
              isFocused={option === focusedOptionSelector(state)}
              dispatch={dispatch}
              {...handleFocusedRef(option)}
            >
              {option.label}
            </Option>
          ))}
        </Menu>
      )}
    </Container>
  );
};
