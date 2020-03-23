import React, { useMemo, useCallback } from "react";

import {
  useCallbackRef,
  useScrollCaptor,
  useScrollToFocused,
  useAugmentedReducer,
  createKeyDownHandler,
  selectReducer,
  SelectState,
  SelectAction,
  AccessibilityPropsProvider,
  AugmentedReducerCustom,
  AugmentedReducerChangeHandler,
} from "@natural-selection/core";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";
import { filteredOptionsSelector, focusedOptionSelector } from "./selectors";

type SingleSelectProps<T> = {
  id?: string;
  "aria-label"?: string;
  options: T[];
  value?: T | null;
  customReducer?: AugmentedReducerCustom<
    State<T>,
    SelectAction<T>,
    Partial<Pick<SingleSelectProps<T>, "value" | "options">>
  >;
  onStateChange?: AugmentedReducerChangeHandler<
    State<T>,
    SelectAction<T>,
    Partial<Pick<SingleSelectProps<T>, "value" | "options">>
  >;
};

type State<T> = SelectState & {
  options: T[];
  value: T | null;
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
  customReducer,
  onStateChange,
  ...rest
}: SingleSelectProps<T>): React.ReactElement => {
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
  const scrollToFocused = useScrollToFocused(menuRef.current);
  const placementStyles = useMenuPlacementStyles(menuRef.current);
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
