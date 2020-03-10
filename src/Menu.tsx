import React, { Dispatch, Reducer, useMemo } from "react";
import {
  useAugmentedReducer,
  useCallbackRef,
  createKeyDownHandler,
  selectReducer,
  SelectState,
  SelectAction,
} from "@natural-selection/core";
import flatMapDeep from "lodash-es/flatMapDeep";
import { createSelector, Selector } from "reselect";

import {
  Menu as BaseMenu,
  Option,
  Container,
  Control,
  Placeholder,
} from "./components";

type SubmenuOptionType = { label: string; options: MenuOptionType[] };
type SelectableMenuOptionType = { label: string; value: string };

type MenuOptionType = SubmenuOptionType | SelectableMenuOptionType;

type State = SelectState & {
  value: SelectableMenuOptionType | null;
  options: MenuOptionType[];
};

const isSubmenu = (option: MenuOptionType): option is SubmenuOptionType =>
  !!(option as SubmenuOptionType).options;

const isSubmenuOpen = (
  option: MenuOptionType,
  focusedOption: MenuOptionType | null,
): boolean => {
  if (option === focusedOption) {
    return true;
  }

  if (!isSubmenu(option)) {
    return false;
  }

  return option.options.some(option => isSubmenuOpen(option, focusedOption));
};

const flattenOptions = (options: MenuOptionType[]): MenuOptionType[] => {
  return flatMapDeep(options, option => {
    if (isSubmenu(option)) {
      return [option, flattenOptions(option.options)];
    }

    return [option];
  });
};

const flatOptionsSelector: Selector<
  { options: MenuOptionType[] },
  MenuOptionType[]
> = createSelector(state => state.options, flattenOptions);

const reducer: Reducer<State, SelectAction<MenuOptionType>> = (
  state,
  action,
) => {
  state = selectReducer(state, action, {
    closeMenuOnSelect: false,
    clearInputOnSelect: false,
    visibleOptionsSelector: flatOptionsSelector,
  });

  switch (action.type) {
    case "textInput":
      if (!action.value) {
        return { ...state, inputValue: action.value };
      }

      const focusedIndex = flatOptionsSelector(state).findIndex(option =>
        option.label.toLowerCase().includes(action.value.toLowerCase()),
      );

      if (focusedIndex < 0) {
        return state;
      }

      return { ...state, focusedIndex };
    case "selectOption":
    case "selectFocused":
      let option: MenuOptionType;
      if (action.type === "selectOption") {
        option = action.option;
      } else {
        option = flatOptionsSelector(state)[state.focusedIndex];
      }

      if (isSubmenu(option)) {
        return state;
      }

      return { ...state, value: option, isMenuOpen: false, inputValue: "" };
    default:
      return state;
  }
};

const MenuInner = React.forwardRef<
  HTMLDivElement,
  {
    focusedOption: MenuOptionType | null;
    options: MenuOptionType[];
    isNested?: boolean;
    dispatch: Dispatch<SelectAction<MenuOptionType>>;
  }
>(function MenuInner({ options, focusedOption, dispatch, isNested }, ref) {
  return (
    <BaseMenu
      css={{
        maxHeight: "initial",
        borderRadius: 0,
        backgroundColor: "transparent",
        overflowY: "visible",
        ...(isNested && { top: "-0.4rem", left: "100%" }),
      }}
      ref={isNested ? undefined : ref}
    >
      {options.map((option, index) => {
        let submenu: React.ReactNode | null = null;

        if (isSubmenu(option) && isSubmenuOpen(option, focusedOption)) {
          submenu = (
            <MenuInner
              options={option.options}
              focusedOption={focusedOption}
              dispatch={dispatch}
              isNested
            />
          );
        }

        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const isFocused = option === focusedOption;
        const isActiveSubmenu = submenu && isSubmenu(option);

        return (
          <Option
            key={option.label}
            option={option}
            isFocused={isFocused}
            dispatch={dispatch}
            css={{
              position: "relative",
              ...(isFirst && {
                borderTopLeftRadius: isNested ? 0 : "0.4rem",
                borderTopRightRadius: isActiveSubmenu ? 0 : "0.4rem",
              }),
              ...(isLast && {
                borderBottomLeftRadius: isNested && isFirst ? 0 : "0.4rem",
                borderBottomRightRadius: isActiveSubmenu ? 0 : "0.4rem",
              }),
            }}
          >
            {option.label}
            {submenu}
          </Option>
        );
      })}
    </BaseMenu>
  );
});

export const Menu: React.FC<{ options: MenuOptionType[] }> = ({ options }) => {
  const [state, dispatch] = useAugmentedReducer(
    reducer,
    {
      value: null,
      options: [],
      focusedIndex: 0,
      inputValue: "",
      isMenuOpen: false,
    },
    useMemo(
      () => ({
        options,
      }),
      [options],
    ),
  );

  const menuRef = useCallbackRef<HTMLDivElement>();
  const handleKeyDown = createKeyDownHandler(dispatch, state);

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        value={state.inputValue}
        menuRef={menuRef.current}
        onMouseDown={() => dispatch({ type: "toggleMenu" })}
        onInputChange={value => dispatch({ type: "textInput", value })}
        onBlur={() => dispatch({ type: "closeMenu" })}
      >
        {!state.inputValue && state.value?.value}
        {!state.inputValue && !state.value && (
          <Placeholder>Pick an option</Placeholder>
        )}
      </Control>

      {state.isMenuOpen && (
        <MenuInner
          ref={menuRef}
          options={state.options}
          focusedOption={flatOptionsSelector(state)[state.focusedIndex]}
          dispatch={dispatch}
        />
      )}
    </Container>
  );
};
