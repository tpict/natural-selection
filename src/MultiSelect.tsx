import React, { Reducer, useCallback, useMemo, useRef } from "react";

import {
  useAugmentedReducer,
  useCallbackRef,
  useEnsuredId,
  useScrollCaptor,
  useScrollDecorator,
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

type MultiSelectProps<T> = {
  id?: string;
  options: T[];
  "aria-label"?: string;
  value?: T[];
  customReducer?: (
    state: State<T>,
    action: SelectAction<T>,
    reducer: Reducer<State<T>, SelectAction<T>>,
  ) => State<T>;
};

type State<T> = SelectState & {
  options: T[];
  value: T[];
};

export const MultiSelect = <T extends { label: string; value: string }>({
  id: providedId,
  options,
  value,
  customReducer,
  ...rest
}: MultiSelectProps<T>): React.ReactElement => {
  const { current: reducer } = useRef<Reducer<State<T>, SelectAction<T>>>(
    (state, action) => {
      switch (action.type) {
        case "selectOption":
        case "selectFocused": {
          let selectedOption: T;
          if (action.type === "selectOption") {
            selectedOption = action.option;
          } else {
            const filteredOptions = filteredOptionsSelector(state);
            selectedOption = filteredOptions[state.focusedIndex];
          }

          state = {
            ...state,
            value: state.value.includes(selectedOption)
              ? state.value.filter(option => option !== selectedOption)
              : state.value.concat([selectedOption]),
          };
          break;
        }
        case "clearLast":
          state = {
            ...state,
            value: state.value.slice(0, state.value.length - 1),
          };
          break;
      }

      return selectReducer(state, action, {
        closeMenuOnSelect: false,
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
      value: [],
      options: [],
    },
    useMemo(() => ({ options, value }), [options, value]),
    customReducer,
  );

  const menuRef = useCallbackRef<HTMLDivElement>();

  const placementStyles = useMenuPlacementStyles(menuRef.current);

  useScrollCaptor(menuRef.current);

  const id = useEnsuredId(providedId);
  const dispatch = useScrollDecorator(
    plainDispatch,
    getDefaultOptionId(
      id,
      focusedOptionSelector(state),
      filteredOptionsSelector(state),
    ),
  );

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
          menuRef={menuRef.current}
          onBlur={useCallback(() => dispatch({ type: "closeMenu" }), [
            dispatch,
          ])}
          onInputChange={value => dispatch({ type: "textInput", value })}
          onMouseDown={() => dispatch({ type: "toggleMenu" })}
        >
          {state.value.map(({ label }) => label).join(", ")}
          {!!state.value.length && state.isMenuOpen && ", "}
          {!state.value.length && !state.inputValue && (
            <Placeholder>Select multiple options</Placeholder>
          )}
        </Control>

        {state.isMenuOpen && (
          <Menu ref={menuRef.callback} css={placementStyles}>
            {filteredOptionsSelector(state).map(option => {
              const isActive = state.value.includes(option);

              return (
                <Option
                  option={option}
                  key={option.value}
                  isActive={isActive}
                  isFocused={option === focusedOptionSelector(state)}
                  dispatch={dispatch}
                  css={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {option.label}

                  <span>{isActive ? "Y" : "N"}</span>
                </Option>
              );
            })}
          </Menu>
        )}
      </Container>
    </AccessibilityPropsProvider>
  );
};
