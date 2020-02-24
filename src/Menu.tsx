import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import flatMapDeep from "lodash-es/flatMapDeep";

import { Input } from "../packages/core/src/components";
import {
  useDefaultKeyDownHandler,
  useCloseOnBlur,
  useManagedFocus,
} from "../packages/core/src/hooks";

import {
  Menu as BaseMenu,
  Option,
  OptionProps,
  Container,
  Control,
  Placeholder,
} from "./components";

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
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [value, setValue] = useState<SelectableMenuOptionType | null>(null);
  const [inputValue, setInputValue] = useState("");

  const handleSelect = useCallback((option: MenuOptionType | null): void => {
    if (!option || !isSubmenu(option)) {
      setValue(option);
    }
  }, []);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const flatOptions = useMemo(() => flattenOptions(options), [options]);

  const { focused, setFocused } = useManagedFocus(flatOptions, isMenuOpen);

  useEffect(() => {
    const option = flatOptions.find(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase()),
    );
    if (option) {
      setFocused(option);
    }
  }, [inputValue, flatOptions, setFocused]);

  const handleKeyDownDefault = useDefaultKeyDownHandler(
    flatOptions,
    {
      focused,
      isMenuOpen,
      inputValue,
    },
    {
      handleValueChange: handleSelect,
      handleFocusChange: setFocused,
      handleInputChange: setInputValue,
      setMenuOpen,
    },
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent): void => {
      if (event.key === "Backspace") {
        if (inputValue) {
          return;
        }

        setValue(null);
        event.preventDefault();
      } else {
        handleKeyDownDefault(event);
      }
    },
    [handleKeyDownDefault, inputValue],
  );

  useEffect(() => {
    setInputValue("");
  }, [value]);

  useEffect(() => {
    setMenuOpen(false);
  }, [value]);

  useEffect(() => {
    if (inputValue) {
      setMenuOpen(true);
    }
  }, [inputValue]);

  const handleInputBlur = useCloseOnBlur(inputRef, menuRef, () =>
    setMenuOpen(false),
  );

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        onMouseDown={event => {
          event.preventDefault();
          setMenuOpen(!isMenuOpen);
          inputRef.current?.focus();
        }}
      >
        {!inputValue && value?.value}
        {!inputValue && !value && <Placeholder>Pick an option</Placeholder>}
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
