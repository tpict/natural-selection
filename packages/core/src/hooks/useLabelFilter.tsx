import { useMemo } from "react";

export const useLabelFilter = <T extends { label: string }>(
  options: T[],
  filter: string,
): T[] => {
  const filteredOptions = useMemo(
    () =>
      options.filter(option =>
        option.label.toLowerCase().includes(filter.toLowerCase()),
      ),
    [filter, options],
  );

  return filteredOptions;
};
