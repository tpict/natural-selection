import React, { Reducer } from "react";
import { parseDate as chrono } from "chrono-node";
import dayjs, { Dayjs } from "dayjs";
import { useTheme } from "@emotion/react";
import range from "lodash-es/range";
import {
  useCallbackRef,
  useAugmentedReducer,
  createKeyDownHandler,
  simpleMemo,
  selectReducer,
  SelectState,
  SelectAction,
} from "@natural-selection/core";
import { createSelector, Selector } from "reselect";

import {
  Menu,
  Option,
  OptionProps,
  Control,
  Container,
  Placeholder,
} from "./components";
import { useMenuPlacementStyles } from "./hooks";
import { UnreachableCaseError } from "./utils";

type DayOptionType = {
  type: "day";
  value: Dayjs;
  label: number;
};

type MonthOptionType = {
  type: "month";
  value: number;
  label: string;
};

type YearOptionType = {
  type: "year";
  value: number;
  label: number;
};

type SelectMonthOptionType = { type: "selectMonth" };
const selectMonthOption: SelectMonthOptionType = { type: "selectMonth" };

type SelectYearOptionType = { type: "selectYear" };
const selectYearOption: SelectYearOptionType = { type: "selectYear" };

type NavOption = SelectMonthOptionType | SelectYearOptionType;

type CalendarOption = DayOptionType | MonthOptionType | YearOptionType;

type DatePickerOption = NavOption | CalendarOption;

const getDayOptions = (date: Dayjs): DayOptionType[] => {
  const dayOfYear = date.startOf("month").dayOfYear();
  const daysInMonth = date.daysInMonth();
  const leadingDays = date.startOf("month").day();
  const trailingDays = 7 - ((daysInMonth + leadingDays) % 7);

  return range(daysInMonth + leadingDays + trailingDays).map(i => {
    const day = dayjs(date).dayOfYear(i + dayOfYear - leadingDays);
    return {
      type: "day",
      value: day,
      label: day.date(),
    };
  });
};

const monthOptions: MonthOptionType[] = [
  { type: "month", value: 0, label: "January" },
  { type: "month", value: 1, label: "February" },
  { type: "month", value: 2, label: "March" },
  { type: "month", value: 3, label: "April" },
  { type: "month", value: 4, label: "May" },
  { type: "month", value: 5, label: "June" },
  { type: "month", value: 6, label: "July" },
  { type: "month", value: 7, label: "August" },
  { type: "month", value: 8, label: "September" },
  { type: "month", value: 9, label: "October" },
  { type: "month", value: 10, label: "November" },
  { type: "month", value: 11, label: "December" },
];

const getYearOptions = (date: Dayjs): YearOptionType[] => {
  return range(40).map(i => {
    const year = date.year() + i - 20;
    return {
      type: "year",
      value: year,
      label: year,
    };
  });
};

const suggestions = [
  "sunday",
  "saturday",
  "friday",
  "thursday",
  "wednesday",
  "tuesday",
  "monday",
  "december",
  "november",
  "october",
  "september",
  "august",
  "july",
  "june",
  "may",
  "april",
  "march",
  "february",
  "january",
  "yesterday",
  "tomorrow",
  "today",
];

const parseDate = (inputValue: string): Dayjs | null => {
  if (!inputValue) {
    return null;
  }

  const autocompletedInput = suggestions.find(suggestion =>
    suggestion.startsWith(inputValue.toLowerCase()),
  );
  const date = chrono(autocompletedInput || inputValue);

  return date ? dayjs(date) : null;
};

type State = SelectState & {
  value: Dayjs | null;
  dayOptions: DayOptionType[];
  mode: "day" | "month" | "year";
};

const firstOfMonthSelector: Selector<
  Pick<State, "dayOptions">,
  Dayjs
> = createSelector(
  state => state.dayOptions,
  dayOptions => {
    const firstOfMonth = dayOptions.find(({ value }) => value.date() === 1)
      ?.value;
    if (!firstOfMonth) {
      throw new Error();
    }

    return firstOfMonth;
  },
);

const navOptionsSelector: Selector<
  Pick<State, "mode">,
  NavOption[]
> = createSelector(
  state => state.mode,
  mode => {
    switch (mode) {
      case "day":
        return [selectMonthOption, selectYearOption];
      case "month":
        return [selectMonthOption];
      case "year":
        return [selectYearOption];
      default:
        throw new UnreachableCaseError(mode);
    }
  },
);

const yearOptionsSelector: Selector<
  Pick<State, "dayOptions">,
  YearOptionType[]
> = createSelector(
  state => state.dayOptions,
  dayOptions => getYearOptions(dayOptions[0].value),
);

const optionsSelector = createSelector<
  Pick<State, "mode" | "dayOptions">,
  State["mode"],
  NavOption[],
  State["dayOptions"],
  YearOptionType[],
  DatePickerOption[]
>(
  state => state.mode,
  navOptionsSelector,
  state => state.dayOptions,
  yearOptionsSelector,
  (mode, navOptions, dayOptions, yearOptions) => {
    switch (mode) {
      case "day":
        return [...navOptions, ...dayOptions];
      case "month":
        return [...navOptions, ...monthOptions];
      case "year":
        return [...navOptions, ...yearOptions];
      default:
        throw new UnreachableCaseError(mode);
    }
  },
);

const getIsOptionFocused = (option: DatePickerOption, state: State): boolean =>
  optionsSelector(state).indexOf(option) === state.focusedIndex;

const reducer: Reducer<State, SelectAction<DatePickerOption>> = (
  state,
  action,
) => {
  state = selectReducer(state, action, {
    clearInputOnSelect: false,
    closeMenuOnSelect: false,
    resetFocusOnInput: false,
    visibleOptionsSelector: optionsSelector,
  });

  switch (action.type) {
    case "textInput": {
      if (!action.value) {
        return state;
      }

      const dateToFocus = parseDate(action.value);
      if (!dateToFocus) {
        return state;
      }

      let { dayOptions } = state;
      if (!dateToFocus.isSame(firstOfMonthSelector(state), "month")) {
        dayOptions = getDayOptions(dateToFocus);
      }

      const focusedIndex = optionsSelector({
        mode: "day",
        dayOptions,
      }).findIndex(
        option =>
          option.type === "day" && option.value.isSame(dateToFocus, "day"),
      );

      if (focusedIndex < 0) {
        throw new Error();
      }

      return {
        ...state,
        focusedIndex: focusedIndex,
        dayOptions,
        mode: "day",
      };
    }
    case "selectOption":
    case "selectFocused":
      let option: DatePickerOption;
      if (action.type === "selectOption") {
        option = action.option;
      } else {
        option = optionsSelector(state)[state.focusedIndex];
      }

      switch (option.type) {
        case "day":
          return {
            ...state,
            value: option.value,
            isMenuOpen: false,
            inputValue: "",
          };
        case "month": {
          const firstOfMonth = firstOfMonthSelector(state);
          return {
            ...state,
            mode: "day",
            dayOptions: getDayOptions(firstOfMonth.month(option.value)),
          };
        }
        case "year": {
          const firstOfMonth = firstOfMonthSelector(state);
          return {
            ...state,
            mode: "day",
            dayOptions: getDayOptions(firstOfMonth.year(option.value)),
          };
        }
        case "selectMonth":
          return { ...state, mode: state.mode === "day" ? "month" : "day" };
        case "selectYear":
          return { ...state, mode: state.mode === "day" ? "year" : "day" };
        default:
          throw new UnreachableCaseError(option);
      }
    case "clearLast":
      return { ...state, value: null };
    default:
      return state;
  }
};

const DayOption = simpleMemo(function DayOption(
  props: OptionProps<DayOptionType>,
): React.ReactElement {
  return (
    <Option {...props}>
      <div css={{ paddingBottom: "100%" }}>
        <div
          css={{
            position: "absolute",
            top: "0.25rem",
            left: "0.25rem",
          }}
        >
          {props.option.label}
        </div>
      </div>
    </Option>
  );
});

export const DatePicker: React.FC<{ "aria-label"?: string }> = props => {
  const [state, dispatch] = useAugmentedReducer(reducer, {
    isMenuOpen: false,
    inputValue: "",
    focusedIndex: 0,
    value: null,
    mode: "day",
    dayOptions: getDayOptions(dayjs()),
  });

  const menuRef = useCallbackRef<HTMLDivElement>();

  const theme = useTheme();
  const { maxHeight: _m, ...position } = useMenuPlacementStyles(
    menuRef.current,
    {
      maxHeight: 500,
      minHeight: 500,
    },
  );

  const firstOfMonth = firstOfMonthSelector(state);

  const handleKeyDown = createKeyDownHandler(dispatch, state);

  const navOptionsNode = (
    <div
      css={{
        display: "flex",
        justifyContent: "center",
        width: "100%",
        padding: theme.space.datePicker.padding,
      }}
    >
      {navOptionsSelector(state).map(option => (
        <Option
          key={option.type}
          option={option}
          dispatch={dispatch}
          css={{
            color: theme.colors.background,
            borderWidth: 0,
            borderBottomWidth: theme.space.datePicker.activeNavIndicator,
            borderStyle: "solid",
            borderColor: "transparent",
            margin: theme.space.datePicker.navOptionMargin,

            ...(getIsOptionFocused(option, state) && {
              borderColor: theme.colors.background,
            }),
          }}
        >
          {option.type === "selectMonth"
            ? firstOfMonth.format("MMMM")
            : firstOfMonth.year()}
        </Option>
      ))}
    </div>
  );

  const optionsNode = (() => {
    switch (state.mode) {
      case "day":
        return (
          <div
            css={{
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "0.4rem",
            }}
          >
            {state.dayOptions.map(option => (
              <DayOption
                key={option.value.dayOfYear()}
                option={option}
                isActive={state.value?.isSame(option.value)}
                isFocused={getIsOptionFocused(option, state)}
                dispatch={dispatch}
                css={{
                  position: "relative",
                  padding: 0,
                  width: "calc(100% / 7)",
                  ...(option.value.month() !== firstOfMonth.month() && {
                    opacity: 0.5,
                  }),
                }}
              />
            ))}
          </div>
        );
      case "month":
        return (
          <div>
            {monthOptions.map(option => (
              <Option
                key={option.value}
                option={option}
                isActive={false}
                isFocused={getIsOptionFocused(option, state)}
                dispatch={dispatch}
              >
                {option.label}
              </Option>
            ))}
          </div>
        );
      case "year":
        return (
          <div
            css={{ display: "flex", flexWrap: "wrap", position: "relative" }}
          >
            {yearOptionsSelector(state).map(option => (
              <Option
                key={option.value}
                option={option}
                isActive={false}
                isFocused={getIsOptionFocused(option, state)}
                dispatch={dispatch}
                css={{
                  padding: 0,
                  width: "25%",
                }}
              >
                {option.label}
              </Option>
            ))}
          </div>
        );
      default:
        throw new UnreachableCaseError(state.mode);
    }
  })();

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        value={state.inputValue}
        aria-label={props["aria-label"]}
        menuRef={menuRef.current}
        onInputChange={value => dispatch({ type: "textInput", value })}
        onBlur={() => dispatch({ type: "closeMenu" })}
        onMouseDown={() => dispatch({ type: "toggleMenu" })}
      >
        {!state.inputValue &&
          state.value?.calendar(undefined, {
            sameDay: "[Today] (MM/DD/YYYY)",
            nextDay: "[Tomorrow] (MM/DD/YYYY)",
            nextWeek: "[Next] dddd (MM/DD/YYYY)",
            lastDay: "[Yesterday] (MM/DD/YYYY)",
            lastWeek: "[Last] dddd (MM/DD/YYYY)",
            sameElse: "MM/DD/YYYY",
          })}
        {!state.inputValue && !state.value && (
          <Placeholder>Pick a date</Placeholder>
        )}
      </Control>

      {state.isMenuOpen && (
        <Menu data-testid={"datepicker-menu"} ref={menuRef} css={position}>
          {navOptionsNode}
          {optionsNode}
        </Menu>
      )}
    </Container>
  );
};
