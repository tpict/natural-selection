import { useMemo, useEffect } from "react";

export const useLabelFilter = <T extends { label: string }>(
  options: T[],
  focused: T | null,
  setFocused: (option: T) => void,
  filter: string,
): T[] => {
  const filteredOptions = useMemo(
    () =>
      options.filter(option =>
        option.label.toLowerCase().includes(filter.toLowerCase()),
      ),
    [filter, options],
  );

  useEffect(() => {
    if (!focused || !filteredOptions.includes(focused)) {
      setFocused(filteredOptions[0]);
    }
  }, [filteredOptions, focused, setFocused]);

  return filteredOptions;
};
