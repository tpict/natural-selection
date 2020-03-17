import { createContext } from "react";

export type AccessibilityContextType = {
  controlProps: {
    "aria-owns"?: string;
    "aria-haspopup"?: "listbox";
  };
  inputProps: {
    id?: string;
    role?: "combobox";
    "aria-activedescendant"?: string;
    "aria-controls"?: string;
  };
  menuProps: {
    role?: "listbox";
    id?: string;
  };
  getOptionProps: <OptionType>(
    option: OptionType,
    state: {
      isFocused?: boolean;
    },
  ) => { "aria-selected"?: boolean; role?: "option"; id?: string };
};

let hasDisplayedAccessibilityWarning = false;

const accessibilityWarning = (): {} => {
  if (!hasDisplayedAccessibilityWarning) {
    console.warn(
      "Your application is using components provided by Natural Selection without the recommended ARIA attributes. Please consider wrapping your components with the built-in AccessibilityPropsProvider.",
    );
    hasDisplayedAccessibilityWarning = true;
  }

  return {};
};

export const AccessibilityContext = createContext<AccessibilityContextType>({
  get controlProps() {
    return accessibilityWarning();
  },
  get inputProps() {
    return accessibilityWarning();
  },
  get menuProps() {
    return accessibilityWarning();
  },
  getOptionProps: accessibilityWarning,
});
