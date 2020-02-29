import React, { useCallback, useRef } from "react";
import AutosizeInput, { AutosizeInputProps } from "react-input-autosize";

import { useStickyBlur } from "./hooks";
import { simpleMemo, preventDefault } from "./utils";

// Using the generic type paramters on React.forwardRef results in weirdly
// typed declaration files - every prop becomes required
export const Input: React.ForwardRefExoticComponent<AutosizeInputProps &
  React.RefAttributes<HTMLInputElement>> = React.forwardRef(function Input(
  props,
  ref,
) {
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
});

export type InputProps = React.ComponentProps<typeof Input>;

export type ControlProps = InputProps & {
  onInputChange: (value: string) => void;
  menuRef: HTMLElement | null;
};

export const Control: React.FC<ControlProps> = ({
  children,
  menuRef,
  className,
  onBlur,
  onMouseDown,
  onMouseUp,
  onClick,
  onChange,
  onInputChange,
  ...rest
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const handleBlur = useStickyBlur(menuRef, onBlur);

  return (
    <div
      onBlur={handleBlur}
      onMouseDown={useCallback(
        event => {
          event.preventDefault();
          inputRef.current?.focus();
          onMouseDown?.(event);
        },
        [onMouseDown],
      )}
      {...{
        className,
        onMouseUp,
        onClick,
      }}
    >
      {children}
      <Input
        ref={inputRef}
        onChange={useCallback(
          event => {
            onChange?.(event);
            onInputChange?.(event.currentTarget.value);
          },
          [onChange, onInputChange],
        )}
        {...rest}
      />
    </div>
  );
};

export type OptionProps<T> = JSX.IntrinsicElements["div"] & {
  option: T;
  handleFocus: (option: T | null) => void;
  handleSelect: (option: T | null) => void;
  innerRef?: React.Ref<HTMLDivElement>;
};

export const Option = simpleMemo(function Option<T>({
  option,
  handleFocus,
  handleSelect,
  innerRef,
  ...rest
}: OptionProps<T>) {
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
      onMouseDown={preventDefault}
      onClick={onClick}
      onMouseOver={onMouseOver}
    />
  );
});
