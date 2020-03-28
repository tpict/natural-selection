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
  children: React.ReactNode | ((input: React.ReactNode) => React.ReactNode);
  autosizeInputProps?: InputProps;
};

export const Control = ({
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
  autosizeInputProps,
  ...rest
}: ControlProps): React.ReactElement => {
  const defaultInputRef = useRef<HTMLInputElement | null>(null);
  const handleBlur = useStickyBlur(menuRef, onBlur);
  const { inputProps: accessibilityProps } = useAccessibilityProps();

  const input = (
    <Input
      {...rest}
      {...accessibilityProps}
      {...autosizeInputProps}
      ref={inputRef ?? defaultInputRef}
      onChange={useCallback(
        event => {
          onChange?.(event);
          onInputChange?.(event.currentTarget.value);
        },
        [onChange, onInputChange],
      )}
    />
  );

  return (
    // I am justifying this as "the element isn't really interactive, it just a
    // decorative element that passes its focus to the input tag within".
    // Also, keyboard events are handled by the parent Container component.
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions,jsx-a11y/click-events-have-key-events
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
      {children instanceof Function ? (
        children(input)
      ) : (
        <>
          {children}
          {input}
        </>
      )}
    </div>
  );
};

export type OptionProps<T> = JSX.IntrinsicElements["div"] & {
  option: T;
  dispatch: Dispatch<SelectOptionAction<T> | FocusOptionAction<T>>;
  innerRef?: React.Ref<HTMLDivElement>;
  isDisabled?: boolean;
  isFocused?: boolean;
};

export const Option = simpleMemo(function Option<T>({
  option,
  dispatch,
  innerRef,
  isDisabled,
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

  const onMouseMove = useCallback(
    (event: React.SyntheticEvent) => {
      event.stopPropagation();
      dispatch({ type: "focusOption", option });
    },
    [dispatch, option],
  );

  return (
    // ARIA role is provided by useAccessibilityProps
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      {...rest}
      {...getAccessibilityProps(option, { isFocused, isDisabled })}
      ref={innerRef}
      tabIndex={-1}
      onMouseDown={preventDefault}
      {...(!isDisabled && {
        onClick,
        onMouseMove,
      })}
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
    // ARIA role is provided by useAccessibilityProps
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
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
    options: readonly OptionType[],
  ) => string;
  getOptionLabel?: (option: OptionType) => string | number | undefined;
  focusedOption: OptionType | null;
  options: readonly OptionType[];
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
        getOptionProps: (option, { isFocused, isDisabled }) => {
          const index = options.indexOf(option as OptionType);
          const label = getOptionLabel(option as OptionType);

          return {
            role: "option",
            "aria-selected": isFocused,
            "aria-disabled": isDisabled,
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
