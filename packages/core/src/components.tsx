import React, { Dispatch, useCallback, useRef } from "react";
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

export type ControlProps = Omit<InputProps, "inputRef"> & {
  onInputChange: (value: string) => void;
  menuRef: HTMLElement | null;
  inputRef?: React.MutableRefObject<HTMLInputElement | null>;
};

export const Control: React.FC<ControlProps> = ({
  children,
  inputRef,
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
  const defaultInputRef = useRef<HTMLInputElement | null>(null);
  const handleBlur = useStickyBlur(menuRef, onBlur);

  return (
    <div
      onBlur={handleBlur}
      onMouseDown={useCallback(
        event => {
          event.preventDefault();
          (inputRef ?? defaultInputRef).current?.focus();
          onMouseDown?.(event);
        },
        [onMouseDown, inputRef],
      )}
      {...{
        className,
        onMouseUp,
        onClick,
      }}
    >
      {children}
      <Input
        ref={inputRef ?? defaultInputRef}
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
  dispatch: Dispatch<
    { type: "selectOption"; option: T } | { type: "focusOption"; option: T }
  >;
  innerRef?: React.Ref<HTMLDivElement>;
};

export const Option = simpleMemo(function Option<T>({
  option,
  dispatch,
  innerRef,
  ...rest
}: OptionProps<T>) {
  const onClick = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      dispatch({ type: "selectOption", option });
    },
    [dispatch, option],
  );

  const onMouseOver = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      dispatch({ type: "focusOption", option });
    },
    [dispatch, option],
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
