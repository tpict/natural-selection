import React, { useCallback } from "react";
import AutosizeInput, { AutosizeInputProps } from "react-input-autosize";

import { simpleMemo } from "./util";

export const Input = React.forwardRef<HTMLInputElement, AutosizeInputProps>(
  function Input(props, ref) {
    return (
      <AutosizeInput
        ref={ref as any}
        inputStyle={{
          background: "0px center",
          border: "0",
          fontFamily: "inherit",
          fontSize: "inherit",
          opacity: 1,
          outline: 0,
          padding: 0,
          color: "inherit",
        }}
        {...props}
      />
    );
  },
);

export type OptionProps<T> = JSX.IntrinsicElements["div"] & {
  option: T;
  handleFocus: (option: T | null) => void;
  handleSelect: (option: T | null) => void;
};

export const Option = simpleMemo(function Option<T>({
  option,
  handleFocus,
  handleSelect,
  innerRef,
  ...rest
}: OptionProps<T> & {
  innerRef?: React.MutableRefObject<HTMLDivElement | null>;
}) {
  const onClick = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      handleSelect(option);
    },
    [handleSelect, option],
  );

  const onMouseOver = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      handleFocus(option);
    },
    [handleFocus, option],
  );

  return (
    <div
      {...rest}
      ref={innerRef}
      tabIndex={-1}
      onClick={onClick}
      onMouseOver={onMouseOver}
      /* onMouseMove={onMouseOver} */
    />
  );
});
