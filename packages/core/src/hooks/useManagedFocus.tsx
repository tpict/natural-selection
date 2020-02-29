import { useCallback, useEffect, useState } from "react";

const defaultGetIsFocusable = <T extends object & { isDisabled?: boolean }>({
  isDisabled,
}: T): boolean => !isDisabled;

export const useManagedFocus = <T extends object & { isDisabled?: boolean }>(
  options: T[],
  {
    getIsFocusable = defaultGetIsFocusable,
  }: {
    getIsFocusable?: (option: T) => boolean;
    initialFocus?: T;
  } = {},
): [T | null, (focused: T | null) => void, (direction: number) => void] => {
  const [focused, setFocused_] = useState<T | null>(options[0] || null);

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

  const focusRelativeOption = useCallback(
    (direction: number): void => {
      if (!focused) {
        return;
      }

      const newIndex = Math.max(
        Math.min(options.indexOf(focused) + direction, options.length - 1),
        0,
      );

      setFocused(options[newIndex]);
    },
    [options, focused, setFocused],
  );

  useEffect(() => {
    if (!focused || !options.includes(focused)) {
      const newFocused = options.filter(getIsFocusable)?.[0] || null;
      setFocused_(newFocused);
    }
  }, [options, getIsFocusable, focused]);

  return [focused, setFocused, focusRelativeOption];
};
