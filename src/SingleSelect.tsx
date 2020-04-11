import React, { useState, useMemo, useCallback } from "react";

import {
  useScrollCaptor,
  useScrollToFocused,
  useControlledReducer,
  createKeyDownHandler,
  selectReducer,
  SelectState,
  SelectAction,
  AccessibilityPropsProvider,
} from "@natural-selection/core";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";
import { filteredOptionsSelector, focusedOptionSelector } from "./selectors";

type State<T> = SelectState & {
  options: T[];
  value: T | null;
};

type SingleSelectProps<T> = {
  id?: string;
  "aria-label"?: string;
  options: T[];
  value?: T | null;
  onStateChange?: (
    state: State<T>,
    action: SelectAction<T>,
    prevState: State<T>,
  ) => void;
};

const reducer = <OptionType extends { label: string }>(
  state: State<OptionType>,
  action: SelectAction<OptionType>,
): State<OptionType> => {
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
};

export const SingleSelect = <
  T extends { value: string; label: string; isDisabled?: boolean }
>({
  id,
  options,
  value,
  onStateChange,
  ...rest
}: SingleSelectProps<T>): React.ReactElement => {
  const [state, dispatch] = useControlledReducer(
    reducer,
    {
      isMenuOpen: false,
      inputValue: "",
      focusedIndex: 0,
      value: null,
      options: [],
    },
    useMemo(() => ({ value, options }), [value, options]),
    onStateChange,
  );

  const [menuRef, setMenuRef] = useState<HTMLDivElement | null>(null);
  useScrollCaptor(menuRef);
  const scrollToFocused = useScrollToFocused(menuRef);
  const placementStyles = useMenuPlacementStyles(menuRef);
  const handleKeyDown = createKeyDownHandler(dispatch, state, scrollToFocused);

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
          menuRef={menuRef}
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
          <Menu ref={setMenuRef} css={placementStyles}>
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
