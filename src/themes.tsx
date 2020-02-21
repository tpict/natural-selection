import React from "react";

export const DynamicThemeContext = React.createContext<
  React.Dispatch<React.SetStateAction<Theme>>
>(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function

export const blueOnPink = {
  colors: {
    foreground: "blue",
    foregroundFocused: "DodgerBlue",
    foregroundActive: "DarkBlue",
    background: "white",
  },
  space: {
    datePicker: {
      padding: "0.25rem",
      navOptionMargin: "0 0.125rem",
      activeNavIndicator: "0.1875rem",
    },
  },
};

export type Theme = typeof blueOnPink;

export const pinkOnBlue: Theme = {
  ...blueOnPink,
  colors: {
    foreground: "pink",
    foregroundFocused: "LightPink",
    foregroundActive: "LightCoral",
    background: "blue",
  },
};
