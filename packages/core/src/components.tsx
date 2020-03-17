import React, { Dispatch, useCallback, useRef } from "react";
import AutosizeInput, { AutosizeInputProps } from "react-input-autosize";

import { AriaRoles, AccessibilityContext } from "./context";
import { useAccessibilityProps, useEnsuredId, useStickyBlur } from "./hooks";
import { SelectOptionAction, FocusOptionAction } from "./reducers";
import { simpleMemo, preventDefault, getDefaultOptionId } from "./utils";

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

export type AccessibilityPropsProviderProps<OptionType> = {
  role: AriaRoles;
  id?: string;
  prefix?: string;
  getOptionId?: (
    prefix: string,
    option: OptionType,
    options: OptionType[],
  ) => string;
  getOptionLabel?: (option: OptionType) => string | number | undefined;
  focusedOption: OptionType | null;
  options: OptionType[];
};

export const AccessibilityPropsProvider = <OptionType extends unknown>({
  role,
  id: providedId,
  focusedOption,
  options,
  children,
  getOptionId: getCustomOptionId,
  getOptionLabel: getCustomOptionLabel,
}: React.PropsWithChildren<
  AccessibilityPropsProviderProps<OptionType>
>): React.ReactElement => {
  const id = useEnsuredId(providedId);
  const menuId = `${id}-${role}`;

  const getOptionId = getCustomOptionId ?? getDefaultOptionId;

  const getOptionLabel =
    getCustomOptionLabel ?? (option => (option as { label: string }).label);

  return (
    <AccessibilityContext.Provider
      value={{
        controlProps: { "aria-owns": menuId, "aria-haspopup": role },
        inputProps: {
          id,
          role: "combobox",
          "aria-controls": menuId,
          ...(focusedOption && {
            "aria-activedescendant": getOptionId(id, focusedOption, options),
          }),
        },
        menuProps: { id: menuId, role },
        getOptionProps: (option, { isFocused }) => {
          const index = options.indexOf(option as OptionType);
          const label = getOptionLabel(option as OptionType);

          return {
            role: "option",
            "aria-selected": isFocused,
            ...(index > -1 && {
              id: getOptionId(id, option as OptionType, options),
            }),
            ...(label && { "aria-label": label }),
          };
        },
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};
