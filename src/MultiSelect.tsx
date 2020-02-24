import React, { useState, useEffect, useRef, useCallback } from "react";

import { Input } from "../packages/core/src/components";
import {
  useDefaultKeyDownHandler,
  useCloseOnBlur,
  useLabelFilter,
  useManagedFocus,
  useScrollToFocused,
  useScrollCaptor,
} from "../packages/core/src/hooks";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";

type MultiSelectProps<T> = {
  options: T[];
};

export const MultiSelect = <T extends { label: string; value: string }>({
  options,
}: MultiSelectProps<T>): React.ReactElement => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isMenuOpen, setMenuOpen] = useState<boolean>(false);
  const [value, setValue] = useState<T[]>([]);
  const [inputValue, setInputValue] = useState("");

  const placementStyles = useMenuPlacementStyles(isMenuOpen, menuRef, {
    maxHeight: 300,
    minHeight: 140,
  });

  const toggleValue = (selectedOption: T | null): void => {
    if (!selectedOption) {
      return;
    }

    setValue(value => {
      if (value.includes(selectedOption)) {
        return value.filter(option => selectedOption !== option);
      }

      return value.concat([selectedOption]);
    });
  };

  const { focused, setFocused, handleOptionRef, focusedRef } = useManagedFocus(
    options,
    isMenuOpen,
  );

  useScrollCaptor(menuRef, isMenuOpen);

  const scrollToFocusedOnUpdate = useScrollToFocused(
    isMenuOpen,
    focused,
    menuRef,
    focusedRef,
  );

  const handleKeyDownDefault = useDefaultKeyDownHandler(
    options,
    { focused, isMenuOpen, inputValue },
    {
      handleValueChange: toggleValue,
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

        setValue(value => value.slice(0, value.length - 1));
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

  const filteredOptions = useLabelFilter(
    options,
    focused,
    setFocused,
    inputValue,
  );

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        onMouseDown={event => {
          event.preventDefault();
          inputRef.current?.focus();
          setMenuOpen(!isMenuOpen);
        }}
      >
        {value.map(({ label }) => label).join(", ")}
        {!!value.length && isMenuOpen && ", "}
        {!value.length && !inputValue && (
          <Placeholder>Select multiple options</Placeholder>
        )}
        <Input
          value={inputValue}
          ref={inputRef}
          onChange={event => {
            setInputValue(event.currentTarget.value);
          }}
          onBlur={useCloseOnBlur(inputRef, menuRef, () => setMenuOpen(false))}
        />
      </Control>

      {isMenuOpen && (
        <Menu ref={menuRef} css={placementStyles}>
          {filteredOptions.map(option => {
            const isActive = value.includes(option);

            return (
              <Option
                option={option}
                key={option.value}
                isActive={isActive}
                isFocused={focused?.value === option?.value}
                handleFocus={setFocused}
                handleSelect={toggleValue}
                css={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
                {...handleOptionRef(option)}
              >
                {option.label}

                <span>{isActive ? "Y" : "N"}</span>
              </Option>
            );
          })}
        </Menu>
      )}
    </Container>
  );
};
