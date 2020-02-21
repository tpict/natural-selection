import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import dayjs, { Dayjs } from "dayjs";
import range from "lodash-es/range";
import { parseDate as chrono } from "chrono-node";
import { useTheme } from "@emotion/react";

import { UnreachableCaseError } from "./util";

import { Input } from "../packages/core/src/components";
import { Menu, Option, Control, Container, Placeholder } from "./examples";
import {
  useDefaultKeyDownHandler,
  useCloseOnBlur,
  useManagedFocus,
  useMenuPlacement,
} from "../packages/core/src/hooks";

type DayOptionType = {
  type: "day";
  value: Dayjs;
  label: number;
  isDisabled: boolean;
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
  const trailingDays = (7 - ((daysInMonth + leadingDays) % 7)) % 7;

  return range(daysInMonth + leadingDays + trailingDays).map(i => {
    const day = dayjs(date).dayOfYear(i + dayOfYear - leadingDays);
    return {
      type: "day",
      value: day,
      label: day.date(),
      isDisabled: day.month() !== date.month(),
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

export const DatePicker = (): React.ReactElement => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const [mode, setMode] = useState<"day" | "month" | "year">("day");

  const [dayOptions, setDayOptions] = useState<DayOptionType[]>(
    getDayOptions(dayjs()),
  );

  const firstOfMonth = useMemo(() => {
    const firstOfMonth = dayOptions.find(({ isDisabled }) => !isDisabled)
      ?.value;
    if (!firstOfMonth) {
      throw new Error();
    }

    return firstOfMonth;
  }, [dayOptions]);

  const yearOptions = useMemo(() => getYearOptions(dayOptions[0].value), [
    dayOptions,
  ]);

  const [navOptions, options]: [
    NavOption[],
    DatePickerOption[],
  ] = useMemo(() => {
    let navOptions: NavOption[];

    switch (mode) {
      case "day":
        navOptions = [selectMonthOption, selectYearOption];
        return [navOptions, [...navOptions, ...dayOptions]];
      case "month":
        navOptions = [selectMonthOption];
        return [navOptions, [...navOptions, ...monthOptions]];
      case "year":
        navOptions = [selectYearOption];
        return [navOptions, [...navOptions, ...yearOptions]];
      default:
        throw new UnreachableCaseError(mode);
    }
  }, [mode, dayOptions, yearOptions]);

  const { focused, setFocused } = useManagedFocus(options, isMenuOpen);

  const [value, setValue_] = useState<Dayjs | null>(null);
  const setValue = useCallback(
    (value: DatePickerOption | null): void => {
      if (!value) {
        return setValue_(null);
      }

      switch (value.type) {
        case "day":
          setValue_(value.value);
          setMenuOpen(false);
          return;
        case "month":
          setDayOptions(getDayOptions(firstOfMonth.month(value.value)));
          setMode("day");
          return;
        case "year":
          setDayOptions(getDayOptions(firstOfMonth.year(value.value)));
          setMode("day");
          return;
        case "selectMonth":
          setMode(mode => (mode === "day" ? "month" : "day"));
          return;
        case "selectYear":
          setMode(mode => (mode === "day" ? "year" : "day"));
          return;
        default:
          throw new UnreachableCaseError(value);
      }
    },
    [firstOfMonth],
  );

  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const theme = useTheme();
  const { maxHeight: _m, ...position } = useMenuPlacement(isMenuOpen, menuRef, {
    maxHeight: 500,
    minHeight: 500,
    controlHeight: 48,
  });

  useEffect(() => {
    if (!inputValue) {
      return;
    }

    const dateToFocus = parseDate(inputValue);
    if (!dateToFocus) {
      return;
    }

    let nextDayOptions = dayOptions;
    if (!dateToFocus.isSame(firstOfMonth, "month")) {
      nextDayOptions = getDayOptions(dateToFocus);
      setDayOptions(nextDayOptions);
    }

    const optionToFocus = nextDayOptions.find(({ value }) =>
      value.isSame(dateToFocus, "day"),
    );

    if (!optionToFocus) {
      throw new Error();
    }

    setFocused(optionToFocus);
  }, [inputValue, firstOfMonth, dayOptions, setFocused, value]);

  const handleKeyDownDefault = useDefaultKeyDownHandler(
    options,
    {
      focused,
      isMenuOpen,
      inputValue,
    },
    {
      handleValueChange: setValue,
      handleFocusChange: setFocused,
      handleInputChange: setInputValue,
      setMenuOpen,
    },
  );

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    let horizontalMotion: number;
    let verticalMotion: number;

    switch (mode) {
      case "day":
        horizontalMotion = 1;
        verticalMotion = 7;
        break;
      case "month":
        horizontalMotion = 0;
        verticalMotion = 1;
        break;
      case "year":
        horizontalMotion = 1;
        verticalMotion = 4;
        break;
      default:
        throw new UnreachableCaseError(mode);
    }

    let index: number;

    switch (event.key) {
      case "Backspace":
        if (inputValue) {
          return;
        }

        setValue(null);
        break;
      case "ArrowLeft":
        index = focused
          ? Math.max(options.indexOf(focused) - horizontalMotion, 0)
          : 0;
        setFocused(options[index]);
        break;
      case "ArrowRight":
        index = focused
          ? Math.min(
              options.indexOf(focused) + horizontalMotion,
              options.length - 1,
            )
          : 0;
        setFocused(options[index]);
        break;
      case "ArrowUp":
        index = focused
          ? Math.max(options.indexOf(focused) - verticalMotion, 0)
          : 0;
        setFocused(options[index]);
        break;
      case "ArrowDown":
        index = focused
          ? Math.min(
              options.indexOf(focused) + verticalMotion,
              options.length - 1,
            )
          : 0;
        setFocused(options[index]);
        break;
      default:
        handleKeyDownDefault(event);
        return;
    }

    event.preventDefault();
  };

  useEffect(() => {
    setInputValue("");
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      setMenuOpen(true);
    }
  }, [inputValue]);

  const handleInputBlur = useCloseOnBlur(inputRef, menuRef, () =>
    setMenuOpen(false),
  );

  const optionsNode = (() => {
    switch (mode) {
      case "day":
        return (
          <div
            css={{
              display: "flex",
              flexWrap: "wrap",
              paddingBottom: "0.4rem",
            }}
          >
            {dayOptions.map(option => (
              <Option
                key={option.value.dayOfYear()}
                option={option}
                isActive={value === option.value}
                isFocused={focused === option}
                isDisabled={option.isDisabled}
                handleFocus={setFocused}
                handleSelect={setValue}
                css={{
                  position: "relative",
                  padding: 0,
                  width: "calc(100% / 7)",
                }}
              >
                <div css={{ paddingBottom: "100%" }}>
                  <div
                    css={{
                      position: "absolute",
                      top: "0.25rem",
                      left: "0.25rem",
                    }}
                  >
                    {option.label}
                  </div>
                </div>
              </Option>
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
                isFocused={focused === option}
                handleFocus={setFocused}
                handleSelect={setValue}
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
            {yearOptions.map(option => (
              <Option
                key={option.value}
                option={option}
                isActive={false}
                isFocused={focused === option}
                handleFocus={setFocused}
                handleSelect={setValue}
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
    }
  })();

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        onMouseDown={useCallback(event => {
          event.preventDefault();
          setMenuOpen(isMenuOpen => !isMenuOpen);
          inputRef.current?.focus();
        }, [])}
      >
        {!inputValue &&
          value?.calendar(undefined, {
            sameDay: "[Today] (MM/DD/YYYY)",
            nextDay: "[Tomorrow] (MM/DD/YYYY)",
            nextWeek: "[Next] dddd (MM/DD/YYYY)",
            lastDay: "[Yesterday] (MM/DD/YYYY)",
            lastWeek: "[Last] dddd (MM/DD/YYYY)",
            sameElse: "MM/DD/YYYY",
          })}
        {!inputValue && !value && <Placeholder>Pick a date</Placeholder>}
        <Input
          value={inputValue}
          ref={inputRef}
          onChange={(event: React.ChangeEvent<HTMLInputElement>): void => {
            setInputValue(event.currentTarget.value);
          }}
          onBlur={handleInputBlur}
        />
      </Control>

      {isMenuOpen && (
        <Menu ref={menuRef} css={position}>
          <div
            css={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              padding: theme.space.datePicker.padding,
            }}
          >
            {navOptions.map(option => (
              <Option
                key={option.type}
                option={option}
                handleFocus={setFocused}
                handleSelect={setValue}
                css={{
                  color: theme.colors.background,
                  borderWidth: 0,
                  borderBottomWidth: theme.space.datePicker.activeNavIndicator,
                  borderStyle: "solid",
                  borderColor: "transparent",
                  margin: theme.space.datePicker.navOptionMargin,

                  ...(option === focused && {
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

          {optionsNode}
        </Menu>
      )}
    </Container>
  );
};
