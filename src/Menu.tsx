import React, { useState, useEffect, useCallback, useMemo } from "react";
import flatMapDeep from "lodash-es/flatMapDeep";
import {
  useCallbackRef,
  useCloseOnBlur,
  useManagedFocus,
  useOpenMenuOnType,
  useToggle,
} from "@natural-selection/core";

import {
  Menu as BaseMenu,
  Option,
  OptionProps,
  Container,
  Control,
  Placeholder,
} from "./components";
import { singleValueKeyHandler } from "./utils";

type SubmenuOptionType = { label: string; options: MenuOptionType[] };
type SelectableMenuOptionType = { label: string; value: string };

type MenuOptionType = SubmenuOptionType | SelectableMenuOptionType;

const isSubmenu = (option: MenuOptionType): option is SubmenuOptionType =>
  !!(option as SubmenuOptionType).options;

const isSubmenuOpen = (
  option: MenuOptionType,
  focusedOption: MenuOptionType | null,
): boolean => {
  if (option === focusedOption) {
    return true;
  }

  if (!isSubmenu(option)) {
    return false;
  }

  return option.options.some(option => isSubmenuOpen(option, focusedOption));
};

const flattenOptions = (options: MenuOptionType[]): MenuOptionType[] => {
  return flatMapDeep(options, option => {
    if (isSubmenu(option)) {
      return [option, flattenOptions(option.options)];
    }

    return [option];
  });
};

const MenuInner = React.forwardRef<
  HTMLDivElement,
  {
    focusedOption: MenuOptionType | null;
    options: MenuOptionType[];
    isNested?: boolean;
  } & Pick<OptionProps<MenuOptionType>, "handleSelect" | "handleFocus">
>(function MenuInner(
  { options, focusedOption, handleSelect, handleFocus, isNested },
  ref,
) {
  return (
    <BaseMenu
      css={{
        maxHeight: "initial",
        borderRadius: 0,
        backgroundColor: "transparent",
        overflowY: "visible",
        ...(isNested && { top: "-0.4rem", left: "100%" }),
      }}
      ref={isNested ? undefined : ref}
    >
      {options.map((option, index) => {
        let submenu: React.ReactNode | null = null;

        if (isSubmenu(option) && isSubmenuOpen(option, focusedOption)) {
          submenu = (
            <MenuInner
              options={option.options}
              focusedOption={focusedOption}
              handleSelect={handleSelect}
              handleFocus={handleFocus}
              isNested
            />
          );
        }

        const isFirst = index === 0;
        const isLast = index === options.length - 1;
        const isFocused = option === focusedOption;
        const isActiveSubmenu = submenu && isSubmenu(option);

        return (
          <Option
            key={option.label}
            option={option}
            isFocused={isFocused}
            handleFocus={handleFocus}
            handleSelect={handleSelect}
            css={{
              position: "relative",
              ...(isFirst && {
                borderTopLeftRadius: isNested ? 0 : "0.4rem",
                borderTopRightRadius: isActiveSubmenu ? 0 : "0.4rem",
              }),
              ...(isLast && {
                borderBottomLeftRadius: isNested && isFirst ? 0 : "0.4rem",
                borderBottomRightRadius: isActiveSubmenu ? 0 : "0.4rem",
              }),
            }}
          >
            {option.label}
            {submenu}
          </Option>
        );
      })}
    </BaseMenu>
  );
});

type MultiSelectProps = {
  options: MenuOptionType[];
};

export const Menu: React.FC<MultiSelectProps> = ({ options }) => {
  const [isMenuOpen, setMenuOpen, toggleMenuOpen] = useToggle(false);
  const [value, setValue_] = useState<SelectableMenuOptionType | null>(null);
  const [inputValue, setInputValue] = useState("");
  useOpenMenuOnType(inputValue, setMenuOpen);

  const setValue: typeof setValue_ = useCallback(
    (...args) => {
      setValue_(...args);
      setInputValue("");
      setMenuOpen(false);
    },
    [setMenuOpen],
  );

  const handleSelect = useCallback(
    (option: MenuOptionType | null): void => {
      if (!option || !isSubmenu(option)) {
        setValue(option);
      }
    },
    [setValue],
  );

  const menuRef = useCallbackRef<HTMLDivElement>();

  const flatOptions = useMemo(() => flattenOptions(options), [options]);

  const [focused, setFocused, focusRelativeOption] = useManagedFocus(
    flatOptions,
  );

  useEffect(() => {
    const option = flatOptions.find(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
    if (option) {
      setFocused(option);
    }
  }, [inputValue, flatOptions, setFocused]);

  const handleInputBlur = useCloseOnBlur(menuRef, () => setMenuOpen(false));

  return (
    <Container
      onKeyDown={event =>
        singleValueKeyHandler(
          event,
          {
            focused,
            isMenuOpen,
          },
          {
            focusRelativeOption,
            handleValueChange: handleSelect,
            handleInputChange: setInputValue,
            setMenuOpen,
          },
        )
      }
    >
      <Control
        value={inputValue}
        onMouseDown={toggleMenuOpen}
        onInputChange={setInputValue}
        onBlur={handleInputBlur}
      >
        {!inputValue && value?.value}
        {!inputValue && !value && <Placeholder>Pick an option</Placeholder>}
      </Control>

      {isMenuOpen && (
        <MenuInner
          ref={menuRef}
          options={options}
          focusedOption={focused}
          handleFocus={setFocused}
          handleSelect={handleSelect}
        />
      )}
    </Container>
  );
};
