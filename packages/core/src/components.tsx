import React, { Dispatch, useCallback, useRef } from "react";
import AutosizeInput, { AutosizeInputProps } from "react-input-autosize";

import { AccessibilityContext } from "./context";
import { useAccessibilityProps, useStickyBlur } from "./hooks";
import { SelectOptionAction, FocusOptionAction } from "./reducers";
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
  const { inputProps: accessibilityProps } = useAccessibilityProps();

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
        {...rest}
        {...accessibilityProps}
        ref={inputRef ?? defaultInputRef}
        onChange={useCallback(
          event => {
            onChange?.(event);
            onInputChange?.(event.currentTarget.value);
          },
          [onChange, onInputChange],
        )}
      />
    </div>
  );
};

export type OptionProps<T> = JSX.IntrinsicElements["div"] & {
  option: T;
  dispatch: Dispatch<SelectOptionAction<T> | FocusOptionAction<T>>;
  innerRef?: React.Ref<HTMLDivElement>;
  isFocused?: boolean;
};

export const Option = simpleMemo(function Option<T>({
  option,
  dispatch,
  innerRef,
  isFocused,
  ...rest
}: OptionProps<T>) {
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
      {...rest}
      {...getAccessibilityProps(option, { isFocused })}
      ref={innerRef}
      tabIndex={-1}
      onMouseDown={preventDefault}
      onClick={onClick}
      onMouseMove={onHover}
      onMouseOver={onHover}
    />
  );
});

export type MenuProps = JSX.IntrinsicElements["div"];

export const Menu = React.forwardRef<HTMLDivElement, MenuProps>(function Menu(
  { onMouseDown, ...rest },
  ref,
) {
  const { menuProps: accessibilityProps } = useAccessibilityProps();

  return (
    <div
      {...rest}
      {...accessibilityProps}
      ref={ref}
      onMouseDown={onMouseDown ?? preventDefault}
    />
  );
});

let runningRef = 1;

export type AccessibilityPropsProviderProps<OptionType> = {
  id?: string;
  prefix?: string;
  getOptionId?: (option: OptionType) => string;
  focusedOption: OptionType | null;
  options: OptionType[];
};

export const AccessibilityPropsProvider = <OptionType extends unknown>({
  id: customId,
  prefix = "natural-selection",
  focusedOption,
  options,
  children,
  getOptionId: getCustomOptionId,
}: React.PropsWithChildren<
  AccessibilityPropsProviderProps<OptionType>
>): React.ReactElement => {
  const id = useRef(customId || `${prefix}-${runningRef++}`).current;
  const menuId = `${id}-listbox`;

  const getOptionId =
    getCustomOptionId ??
    (option => {
      const index = options.indexOf(option);
      if (index < -1) {
        throw new Error();
      }

      return `${id}-option-${index}`;
    });

  return (
    <AccessibilityContext.Provider
      value={{
        controlProps: { "aria-owns": menuId, "aria-haspopup": "listbox" },
        inputProps: {
          id,
          role: "combobox",
          "aria-controls": menuId,
          ...(focusedOption && {
            "aria-activedescendant": getOptionId(focusedOption),
          }),
        },
        menuProps: { id: menuId, role: "listbox" },
        getOptionProps: (option, { isFocused }) => {
          const index = options.indexOf(option as OptionType);

          return {
            role: "option",
            "aria-selected": isFocused,
            ...(index > -1 && { id: getOptionId(option as OptionType) }),
          };
        },
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
