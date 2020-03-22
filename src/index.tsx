import React from "react";
import ReactDOM from "react-dom";
import "@emotion/react";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";
import calendar from "dayjs/plugin/calendar";

import { App } from "./App";

dayjs.extend(dayOfYear);
dayjs.extend(calendar);

ReactDOM.render(<App />, document.getElementById("root"));
