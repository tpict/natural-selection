import React from "react";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import ReactMarkdown from "react-markdown";

import useAccessibilityPropsDocs from "!!raw-loader!docs/hooks/useAccessibilityProps.md";
import useControlledReducerDocs from "!!raw-loader!docs/hooks/useControlledReducer.md";
import useEnsuredIdDocs from "!!raw-loader!docs/hooks/useEnsuredId.md";
import useScrollCaptorDocs from "!!raw-loader!docs/hooks/useScrollCaptor.md";
import useScrollToFocusedDocs from "!!raw-loader!docs/hooks/useScrollToFocused.md";
import accessibilityPropsProviderDocs from "!!raw-loader!docs/components/AccessibilityPropsProvider.md";
import optionDocs from "!!raw-loader!docs/components/Option.md";

import { SingleSelectExample } from "./SingleSelectExample";
import { MultiSelectExample } from "./MultiSelectExample";
import { DatePickerExample } from "./DatePickerExample";

export const Docs: React.FC = () => {
  const { path } = useRouteMatch();

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
              <Link to="/docs">Introduction</Link>
            </li>
            <li>
              <Link to="/docs/hooks">Hooks</Link>
              <ul>
                <li>
                  <Link to="/docs/hooks/useAccessibilityProps">
                    useAccessibilityProps
                  </Link>
                </li>

                <li>
                  <Link to="/docs/hooks/useControlledReducer">
                    useControlledReducer
                  </Link>
                </li>

                <li>
                  <Link to="/docs/hooks/useEnsuredId">useEnsuredId</Link>
                </li>

                <li>
                  <Link to="/docs/hooks/useScrollCaptor">useScrollCaptor</Link>
                </li>

                <li>
                  <Link to="/docs/hooks/useScrollToFocused">
                    useScrollToFocused
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              Components
              <ul>
                <li>
                  <Link to="/docs/components/Option">Option</Link>
                </li>

                <li>
                  <Link to="/docs/components/AccessibilityPropsProvider">
                    AccessibilityPropsProvider
                  </Link>
                </li>
              </ul>
            </li>

            <li>
              Examples
              <ul>
                <li>
                  <Link to="/docs/examples/introduction">Introduction</Link>
                </li>

                <li>
                  <Link to="/docs/examples/single-select">Single select</Link>
                </li>

                <li>
                  <Link to="/docs/examples/multi-select">Multi select</Link>
                </li>

                <li>
                  <Link to="/docs/examples/date-picker">Date picker</Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>

        <div
          css={{
            flexGrow: 1,
          }}
        >
          <Switch>
            <Route path={`${path}/hooks/useAccessibilityProps`}>
              <ReactMarkdown source={useAccessibilityPropsDocs} />
            </Route>

            <Route path={`${path}/hooks/useControlledReducer`}>
              <ReactMarkdown source={useControlledReducerDocs} />
            </Route>

            <Route path={`${path}/hooks/useEnsuredId`}>
              <ReactMarkdown source={useEnsuredIdDocs} />
            </Route>

            <Route path={`${path}/hooks/useScrollCaptor`}>
              <ReactMarkdown source={useScrollCaptorDocs} />
            </Route>

            <Route path={`${path}/hooks/useScrollToFocused`}>
              <ReactMarkdown source={useScrollToFocusedDocs} />
            </Route>

            <Route path={`${path}/components/Option`}>
              <ReactMarkdown source={optionDocs} />
            </Route>

            <Route path={`${path}/components/AccessibilityPropsProvider`}>
              <ReactMarkdown source={accessibilityPropsProviderDocs} />
            </Route>

            <Route path={`${path}/examples/single-select`}>
              <SingleSelectExample />
            </Route>

            <Route path={`${path}/examples/multi-select`}>
              <MultiSelectExample />
            </Route>

            <Route path={`${path}/examples/date-picker`}>
              <DatePickerExample />
            </Route>

            <Route path={`${path}/hooks`}>Hello world</Route>

            <Route path={path}>Hello world</Route>
          </Switch>
        </div>
      </div>
    </>
  );
};
