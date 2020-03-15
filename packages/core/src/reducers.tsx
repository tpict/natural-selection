export type SelectState = {
  focusedIndex: number;
  inputValue: string;
  isMenuOpen: boolean;
};

export type SelectOptionAction<OptionType> = {
  type: "selectOption";
  option: OptionType;
};

export type FocusOptionAction<OptionType> = {
  type: "focusOption";
  option: OptionType;
  source?: "keyboard" | "mouse";
};

export type RelativeFocusAction = {
  type: "relativeFocus";
  direction: number;
  source?: "keyboard" | "mouse";
};

export type SelectAction<OptionType> =
  | { type: "textInput"; value: string }
  | { type: "openMenu" }
  | { type: "closeMenu" }
  | { type: "toggleMenu" }
  | FocusOptionAction<OptionType>
  | RelativeFocusAction
  | { type: "selectFocused" }
  | SelectOptionAction<OptionType>
  | { type: "clearLast" };

type SelectReducerConfig<OptionType, State> = {
  openMenuOnInput?: boolean;
  closeMenuOnSelect?: boolean;
  resetFocusOnInput?: boolean;
  clearInputOnSelect?: boolean;
  visibleOptionsSelector?: (state: State) => OptionType[];
};

export const selectReducer = <
  OptionType extends unknown,
  State extends SelectState
>(
  state: State,
  action: SelectAction<OptionType>,
  {
    openMenuOnInput = true,
    resetFocusOnInput = true,
    closeMenuOnSelect = true,
    clearInputOnSelect = true,
    visibleOptionsSelector = state => (state as any).options ?? [],
  }: SelectReducerConfig<OptionType, State>,
): State => {
  switch (action.type) {
    case "openMenu":
      return { ...state, isMenuOpen: true };
    case "closeMenu":
      return { ...state, isMenuOpen: false, focusedIndex: 0 };
    case "toggleMenu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
        ...(state.isMenuOpen && { focusedIndex: 0 }),
      };
    case "textInput":
      return {
        ...state,
        inputValue: action.value,
        ...(resetFocusOnInput && { focusedIndex: 0 }),
        ...(openMenuOnInput &&
          action.value && {
            isMenuOpen: true,
          }),
      };
    case "focusOption":
      const focusedIndex = visibleOptionsSelector(state).indexOf(action.option);
      if (focusedIndex < 0 || focusedIndex === state.focusedIndex) {
        return state;
      }

      return { ...state, focusedIndex };
    case "relativeFocus": {
      const options = visibleOptionsSelector(state);
      let newIndex = (state.focusedIndex + action.direction) % options.length;
      if (newIndex < 0) newIndex += options.length;

      return { ...state, focusedIndex: newIndex };
    }
    case "selectOption":
    case "selectFocused": {
      let nextState = state;
      if (closeMenuOnSelect) nextState = { ...nextState, isMenuOpen: false };
      if (clearInputOnSelect) nextState = { ...nextState, inputValue: "" };
      return nextState;
    }
    default:
      return state;
  }
};
