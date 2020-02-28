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
): [T | null, (focused: T | null) => void] => {
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

  useEffect(() => {
    if (!focused || !options.includes(focused)) {
      const newFocused = options.filter(getIsFocusable)?.[0] || null;
      setFocused_(newFocused);
    }
  }, [options, getIsFocusable, focused]);

  return [focused, setFocused];
};
