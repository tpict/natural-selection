import React from "react";
import { hydrate, render } from "react-dom";
import "@emotion/react";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import calendar from "dayjs/plugin/calendar";

import { App } from "./App";

dayjs.extend(dayOfYear);
dayjs.extend(calendar);

const rootElement = document.getElementById("root");
if (rootElement?.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
