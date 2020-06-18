import React, { useCallback, useEffect, useState } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import { useAccessibilityProps } from "@natural-selection/core";

import { SingleSelect } from "SingleSelect";

const MagicOption: React.FC = ({
  dispatch,
  option,
  isDisabled,
  isActive,
  isFocused,
  registerOption,
  unregisterOption,
}) => {
  useEffect(() => {
    registerOption(option);
    return () => unregisterOption(option);
  }, []);

  const { getOptionProps: getAccessibilityProps } = useAccessibilityProps();

  const onClick = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      dispatch({ type: "selectOption", option });
    },
    [dispatch, option],
  );

  const onHover = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      dispatch({ type: "focusOption", option, source: "mouse" });
    },
    [dispatch, option],
  );

  return (
    <div
      onClick={onClick}
      onMouseMove={onHover}
      onMouseOver={onHover}
      {...getAccessibilityProps(option, { isFocused: isFocused(option), isDisabled })}
      css={theme => ({
        color: theme.colors.background,
        backgroundColor: theme.colors.foreground,
        padding: theme.space.option.padding,
        cursor: "pointer",

        ...(isDisabled && {
          opacity: 0.5,
          cursor: "initial",
        }),
        ...(isActive(option) && {
          backgroundColor: theme.colors.foregroundActive,
        }),
        ...(isFocused(option) && {
          backgroundColor: theme.colors.foregroundFocused,
        }),
      })}
    >
      {option.label}
    </div>
  );
};

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

export const SingleSelectExample: React.FC = () => {
  const [value, setValue] = useState<typeof options[number] | null>(null);

  return (
    <>
      <SingleSelect
        aria-label="Single select example"
        onStateChange={({ value }) => setValue(value)}
      >
        {(props, state) =>
          options
          .filter(option => option.label.toLowerCase().includes(state.inputValue))
            .map(option => (
              <MagicOption key={option.value} {...props} option={option} />
            ))
        }
      </SingleSelect>
    </>
  );
};
