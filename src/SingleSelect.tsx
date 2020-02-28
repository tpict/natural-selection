import React, { useState, useCallback } from "react";

import {
  useCallbackRef,
  useCloseOnBlur,
  useDefaultKeyDownHandler,
  useFocusedRef,
  useLabelFilter,
  useManagedFocus,
  useOpenMenuOnType,
  useScrollCaptor,
  useScrollToFocused,
  useToggle,
} from "@natural-selection/core";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";

type SingleSelectProps<T> = {
  "aria-label"?: string;
  options: T[];
};

export const SingleSelect = <T extends { value: string; label: string }>({
  options,
  ...rest
}: SingleSelectProps<T>): React.ReactElement => {
  const [isMenuOpen, setMenuOpen, toggleMenuOpen] = useToggle(false);
  const [inputValue, setInputValue] = useState("");
  useOpenMenuOnType(inputValue, setMenuOpen);

  const [value, setValue_] = useState<T | null>(null);
  const setValue: typeof setValue_ = useCallback(
    (...args) => {
      setValue_(...args);
      setInputValue("");
      setMenuOpen(false);
    },
    [setMenuOpen],
  );

  const menuRef = useCallbackRef();

  useScrollCaptor(menuRef.current);

  const placementStyles = useMenuPlacementStyles(menuRef.current);
  const filteredOptions = useLabelFilter(options, inputValue);
  const [focused, setFocused] = useManagedFocus(filteredOptions);
  const [focusedRef, handleOptionRef] = useFocusedRef(focused);
  const scrollToFocusedOnUpdate = useScrollToFocused(
    menuRef.current,
    focusedRef,
  );

  const handleKeyDownDefault = useDefaultKeyDownHandler(
    filteredOptions,
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
    [handleKeyDownDefault, inputValue, setValue],
  );

  const handleInputBlur = useCloseOnBlur(menuRef, () => setMenuOpen(false));

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        value={inputValue}
        aria-label={rest["aria-label"]}
        onMouseDown={toggleMenuOpen}
        onInputChange={setInputValue}
        onBlur={handleInputBlur}
      >
        {!inputValue && value?.label}
        {!inputValue && !value && <Placeholder>Pick an option</Placeholder>}
      </Control>

      {isMenuOpen && (
        <Menu ref={menuRef.callback} css={placementStyles}>
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
