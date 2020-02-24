import React from "react";
import { useRouteMatch, Redirect, Link, Route, Switch } from "react-router-dom";

import { SingleSelectExample } from "./SingleSelectExample";
import { MultiSelectExample } from "./MultiSelectExample";
import { DatePickerExample } from "./DatePickerExample";

export const Examples: React.FC = () => {
  const match = useRouteMatch("/examples");

  return (
    <>
      {match?.isExact && <Redirect to="/examples/single-select" />}

      <div css={{ display: "flex", height: "100%" }}>
        <div
          css={theme => ({
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: "10rem",
            color: theme.colors.background,
            backgroundColor: theme.colors.foreground,
          })}
        >
          <ul>
            <li>
              <Link to="/examples/single-select">Single select</Link>
            </li>

            <li>
              <Link to="/examples/multi-select">Multi select</Link>
            </li>

            <li>
              <Link to="/examples/date-picker">Date picker</Link>
            </li>
          </ul>
        </div>

        <div
          css={{
            flexGrow: 1,
          }}
        >
          <Switch>
            <Route path="/examples/single-select">
              <SingleSelectExample />
            </Route>

            <Route path="/examples/multi-select">
              <MultiSelectExample />
            </Route>

            <Route path="/examples/date-picker">
              <DatePickerExample />
            </Route>
          </Switch>
        </div>
      </div>
    </>
  );
};
