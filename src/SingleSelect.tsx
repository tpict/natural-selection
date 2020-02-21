import React, { useState, useEffect, useRef, useCallback } from "react";

import { Input } from "../packages/core/src/components";
import {
  useDefaultKeyDownHandler,
  useCloseOnBlur,
  useLabelFilter,
  useManagedFocus,
  useMenuPlacement,
} from "../packages/core/src/hooks";

import { Menu, Option, Container, Control, Placeholder } from "./examples";

type MultiSelectProps<T> = {
  options: T[];
};

export const SingleSelect = <T extends { value: string; label: string }>({
  options,
}: MultiSelectProps<T>): React.ReactElement => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const [value, setValue] = useState<T | null>(null);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const placement = useMenuPlacement(isMenuOpen, menuRef, {
    maxHeight: 300,
    minHeight: 140,
    controlHeight: 38,
  });

  const { focused, setFocused } = useManagedFocus(options, isMenuOpen);

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

  const filteredOptions = useLabelFilter(
    options,
    focused,
    setFocused,
    inputValue,
  );

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
        {!inputValue && value?.label}
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
        <Menu ref={menuRef} css={placement}>
          {filteredOptions.map(option => (
            <Option
              key={option.value}
              option={option}
              isActive={value?.value === option?.value}
              isFocused={focused?.value === option?.value}
              handleFocus={setFocused}
              handleSelect={setValue}
            >
              {option.label}
            </Option>
          ))}
        </Menu>
      )}
    </Container>
  );
};
