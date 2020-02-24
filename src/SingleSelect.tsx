import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  Input,
  useDefaultKeyDownHandler,
  useCloseOnBlur,
  useLabelFilter,
  useManagedFocus,
  useScrollToFocused,
  useScrollCaptor,
} from "@natural-selection/core";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";

type MultiSelectProps<T> = {
  "aria-label"?: string;
  options: T[];
};

export const SingleSelect = <T extends { value: string; label: string }>({
  options,
  ...rest
}: MultiSelectProps<T>): React.ReactElement => {
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);

  const [value, setValue] = useState<T | null>(null);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useScrollCaptor(menuRef, isMenuOpen);

  const placementStyles = useMenuPlacementStyles(isMenuOpen, menuRef, {
    maxHeight: 300,
    minHeight: 140,
  });

  const { focused, setFocused, handleOptionRef, focusedRef } = useManagedFocus(
    options,
    isMenuOpen,
  );

  const scrollToFocusedOnUpdate = useScrollToFocused(
    isMenuOpen,
    focused,
    menuRef,
    focusedRef,
  );

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
      scrollToFocusedOnUpdate,
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
          aria-label={rest["aria-label"]}
        />
      </Control>

      {isMenuOpen && (
        <Menu ref={menuRef} css={placementStyles}>
          {filteredOptions.map(option => (
            <Option
              key={option.value}
              option={option}
              isActive={value?.value === option?.value}
              isFocused={focused?.value === option?.value}
              handleFocus={setFocused}
              handleSelect={setValue}
              {...handleOptionRef(option)}
            >
              {option.label}
            </Option>
          ))}
        </Menu>
      )}
    </Container>
  );
};
