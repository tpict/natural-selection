import React, { useCallback, useEffect, useRef, useState } from "react";

const defaultGetIsFocusable = <T extends object & { isDisabled?: boolean }>({
  isDisabled,
}: T): boolean => !isDisabled;

const getDefaultInitialFocus = <T extends unknown>(options: T[]): T =>
  options[0];

export const useManagedFocus = <T extends object & { isDisabled?: boolean }>(
  options: T[],
  isMenuOpen: boolean,
  {
    getIsFocusable = defaultGetIsFocusable,
    initialFocus,
  }: {
    getIsFocusable?: (option: T) => boolean;
    initialFocus?: T;
  } = {},
): {
  focused: T | null;
  setFocused: (focused: T | null) => void;
  focusedRef: React.MutableRefObject<HTMLDivElement | null>;
  handleOptionRef: (
    option: T,
  ) => { innerRef: React.MutableRefObject<HTMLDivElement | null> } | undefined;
} => {
  const [focused, setFocused_] = useState<T | null>(null);
  const focusedRef = useRef<HTMLDivElement | null>(null);

  const setFocused = useCallback(
    (focused: T | null): void => {
      if (!focused) {
        setFocused_(null);
        return;
      }

      if (getIsFocusable(focused)) {
        setFocused_(focused);
        return;
      }
    },
    [getIsFocusable],
  );

  useEffect(() => {
    if (isMenuOpen) {
      const focusableOptions = options.filter(getIsFocusable);
      if (!initialFocus) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        initialFocus = getDefaultInitialFocus(focusableOptions);
      }

      setFocused(initialFocus);
    } else {
      setFocused(null);
    }
  }, [isMenuOpen, options, getIsFocusable, setFocused]);

  const handleOptionRef = useCallback(
    (
      option: T,
    ):
      | { innerRef: React.MutableRefObject<HTMLDivElement | null> }
      | undefined => {
      if (option === focused) {
        return { innerRef: focusedRef };
      }

      return;
    },
    [focused],
  );

  return { focused, setFocused, focusedRef, handleOptionRef };
};
