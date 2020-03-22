import React, { useState } from "react";
import { Global, ThemeProvider } from "@emotion/react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import { Examples } from "./Examples";
import { Test } from "./Test";
import { blueOnPink, Theme, DynamicThemeContext } from "./themes";

export const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(blueOnPink);

  return (
    <BrowserRouter>
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
                margin: 0,
              },

              "*, *:before, *:after": {
                boxSizing: "border-box",
              },
            })}
          />

          <Switch>
            <Route path="/examples">
              <Examples />
            </Route>

            <Route path="/test">
              <Test />
            </Route>

            <Route path="/">Coming soon!</Route>
          </Switch>
        </ThemeProvider>
      </DynamicThemeContext.Provider>
    </BrowserRouter>
  );
};
