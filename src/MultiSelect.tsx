import React, { useCallback, useState } from "react";

import {
  useCallbackRef,
  useFocusedRef,
  useLabelFilter,
  useManagedFocus,
  useOpenMenuOnType,
  useScrollCaptor,
  useScrollToFocused,
  useToggle,
  defaultKeyDownHandler,
} from "@natural-selection/core";

import { Menu, Option, Container, Control, Placeholder } from "./components";
import { useMenuPlacementStyles } from "./hooks";

type MultiSelectProps<T> = {
  options: T[];
  "aria-label"?: string;
};

export const MultiSelect = <T extends { label: string; value: string }>({
  options,
  ...rest
}: MultiSelectProps<T>): React.ReactElement => {
  const menuRef = useCallbackRef();
  const [isMenuOpen, setMenuOpen, toggleMenuOpen] = useToggle(false);
  const [value, setValue] = useState<T[]>([]);
  const [inputValue, setInputValue] = useState("");

  useOpenMenuOnType(inputValue, setMenuOpen);

  const placementStyles = useMenuPlacementStyles(menuRef.current);

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

  const filteredOptions = useLabelFilter(options, inputValue);

  const [focused, setFocused, focusRelativeOption] = useManagedFocus(
    filteredOptions,
  );
  const [focusedRef, handleOptionRef] = useFocusedRef(focused);
  useScrollCaptor(menuRef.current);
  const scrollToFocusedOnUpdate = useScrollToFocused(
    menuRef.current,
    focusedRef,
  );

  const handleKeyDown = (event: React.KeyboardEvent): void => {
    if (event.key === "Backspace") {
      if (inputValue) {
        return;
      }

      setValue(value => value.slice(0, value.length - 1));
      event.preventDefault();
    } else {
      defaultKeyDownHandler(
        event,
        { focused, isMenuOpen },
        {
          focusRelativeOption,
          handleValueChange: toggleValue,
          handleInputChange: setInputValue,
          setMenuOpen,
          scrollToFocusedOnUpdate,
        },
      );
    }
  };

  return (
    <Container onKeyDown={handleKeyDown}>
      <Control
        value={inputValue}
        aria-label={rest["aria-label"]}
        menuRef={menuRef.current}
        onBlur={useCallback(() => setMenuOpen(false), [setMenuOpen])}
        onInputChange={setInputValue}
        onMouseDown={toggleMenuOpen}
      >
        {value.map(({ label }) => label).join(", ")}
        {!!value.length && isMenuOpen && ", "}
        {!value.length && !inputValue && (
          <Placeholder>Select multiple options</Placeholder>
        )}
      </Control>

      {isMenuOpen && (
        <Menu ref={menuRef.callback} css={placementStyles}>
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
