import React, { useState } from "react";
import { Global, ThemeProvider } from "@emotion/react";
import { BrowserRouter, Route, Switch, Redirect, Link } from "react-router-dom";

import { Docs } from "./Docs";
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
            <Route
              path="/:url*"
              exact
              strict
              render={props => <Redirect to={`${props.location.pathname}/`} />}
            />

            <Route path="/docs">
              <Docs />
            </Route>

            <Route path="/test">
              <Test />
            </Route>

            <Route path="/">
              <Link to="/docs">Docs</Link>
            </Route>
          </Switch>
        </ThemeProvider>
      </DynamicThemeContext.Provider>
    </BrowserRouter>
  );
};
