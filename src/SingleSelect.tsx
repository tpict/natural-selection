import React, { Reducer, useMemo, useCallback, useRef } from "react";

import {
  useCallbackRef,
  useEnsuredId,
  useScrollCaptor,
  useScrollDecorator,
  useAugmentedReducer,
  createKeyDownHandler,
  selectReducer,
  SelectState,
  SelectAction,
  AccessibilityPropsProvider,
  getDefaultOptionId,
} from "@natural-selection/core";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";
import { filteredOptionsSelector, focusedOptionSelector } from "./selectors";

type SingleSelectProps<T> = {
  id?: string;
  "aria-label"?: string;
  options: T[];
  value?: T | null;
  customReducer?: (
    state: State<T>,
    action: SelectAction<T>,
    reducer: Reducer<State<T>, SelectAction<T>>,
  ) => State<T>;
  onStateChange?: (
    state: State<T>,
    action: SelectAction<T>,
    prevState: State<T>,
  ) => void;
};

type State<T> = SelectState & {
  options: T[];
  value: T | null;
};

export const SingleSelect = <
  T extends { value: string; label: string; isDisabled?: boolean }
>({
  id: providedId,
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

  const [state, plainDispatch] = useAugmentedReducer(
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

  const id = useEnsuredId(providedId);
  const dispatch = useScrollDecorator(
    plainDispatch,
    getDefaultOptionId(
      id,
      focusedOptionSelector(state),
      filteredOptionsSelector(state),
    ),
  );

  const menuRef = useCallbackRef<HTMLDivElement>();
  useScrollCaptor(menuRef.current);
  const placementStyles = useMenuPlacementStyles(menuRef.current);
  const handleKeyDown = createKeyDownHandler(dispatch, state);

  return (
    <AccessibilityPropsProvider
      id={id}
      focusedOption={focusedOptionSelector(state)}
      options={filteredOptionsSelector(state)}
      role="listbox"
    >
      <Container onKeyDown={handleKeyDown}>
        <Control
          value={state.inputValue}
          aria-label={rest["aria-label"]}
          onMouseDown={() => dispatch({ type: "toggleMenu" })}
          onInputChange={value => dispatch({ type: "textInput", value })}
          menuRef={menuRef.current}
          onBlur={useCallback(() => dispatch({ type: "closeMenu" }), [
            dispatch,
          ])}
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
              >
                {option.label}
              </Option>
            ))}
          </Menu>
        )}
      </Container>
    </AccessibilityPropsProvider>
  );
};
