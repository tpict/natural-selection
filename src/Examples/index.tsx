import React from "react";
import { Link, Route, Switch } from "react-router-dom";

import { SingleSelectExample } from "./SingleSelectExample";
import { MultiSelectExample } from "./MultiSelectExample";
import { DatePickerExample } from "./DatePickerExample";

export const Examples: React.FC = () => {
  return (
    <>
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
              <Link to="/examples">Introduction</Link>
            </li>

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

            <Route path="/examples">Hello world</Route>
          </Switch>
        </div>
      </div>
    </>
  );
};
