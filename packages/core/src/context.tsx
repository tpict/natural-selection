import { createContext } from "react";

// TODO: surely this is provided by the JSX interface or something?
export type AriaRoles = "combobox" | "listbox" | "grid" | "menu";

export type AccessibilityContextType = {
  controlProps: {
    "aria-owns"?: string;
    "aria-haspopup"?: AriaRoles;
  };
  inputProps: {
    id?: string;
    role?: "combobox";
    "aria-activedescendant"?: string;
    "aria-controls"?: string;
  };
  menuProps: {
    role?: AriaRoles;
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
