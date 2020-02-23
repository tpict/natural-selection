import React, { useState } from "react";
import { Global, ThemeProvider } from "@emotion/react";

import { SingleSelect } from "./SingleSelect";
import { MultiSelect } from "./MultiSelect";
import { DatePicker } from "./DatePicker";
import { Menu } from "./Menu";
import { blueOnPink, Theme, DynamicThemeContext } from "./themes";

const options = [
  { value: "1", label: "Option 1" },
  { value: "2", label: "Option 2" },
  { value: "3", label: "Option 3" },
  { value: "4", label: "Option 4" },
  { value: "5", label: "Option 5" },
  { value: "6", label: "Option 6" },
  { value: "7", label: "Option 7" },
  { value: "8", label: "Option 8" },
  { value: "9", label: "Option 9" },
  { value: "10", label: "Option 10" },
  { value: "11", label: "Option 11" },
  { value: "12", label: "Option 12" },
  { value: "13", label: "Option 13" },
  { value: "14", label: "Option 14" },
  { value: "15", label: "Option 15" },
  { value: "16", label: "Option 16" },
  { value: "17", label: "Option 17" },
  { value: "18", label: "Option 18" },
  { value: "19", label: "Option 19" },
  { value: "20", label: "Option 20" },
];

const multiOptions = [
  { value: "comp", label: "composable" },
  { value: "hooks", label: "hooks-based" },
  { value: "ts", label: "TypeScript-powered" },
];

const menuOptions = [
  { label: "with submenus", value: "with submenus" },
  {
    label: "with",
    options: [
      { label: "multiple submenus", value: "with multiple submenus" },
      {
        label: "as many",
        options: [
          {
            label: "submenus as you could imagine",
            value: "with as many submenus as you could imagine",
          },
        ],
      },
    ],
  },
];

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(blueOnPink);

  return (
    <DynamicThemeContext.Provider value={setTheme}>
      <ThemeProvider theme={theme}>
        <Global
          styles={theme => ({
            html: {
              fontSize: theme.fontSizes.root,
              lineHeight: theme.lineHeights.root,
            },

            body: {
              backgroundColor: theme.colors.background,
              color: theme.colors.foreground,
            },

            "#root": {
              paddingTop: "65rem",
              paddingBottom: "65rem",
            },

            "*, *:before, *:after": {
              boxSizing: "border-box",
            },
          })}
        />

        <h1>single select</h1>
        <SingleSelect options={options} />

        <h1>multi select</h1>
        <MultiSelect options={multiOptions} />

        <h1>date picker</h1>
        <DatePicker />

        <h1>menu</h1>
        <Menu options={menuOptions} />
      </ThemeProvider>
    </DynamicThemeContext.Provider>
  );
};

export default App;
