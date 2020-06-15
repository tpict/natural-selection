import React from "react";

export const simpleMemo: <T>(fn: T) => T = React.memo;

export const preventDefault = (event: React.SyntheticEvent): void =>
  event.preventDefault();

export const mergeNonUndefinedProperties = <T extends object>(
  target: T,
  source: Partial<T>,
): T => {
  const result = { ...target };

  const sourceEntries = Object.entries(source) as Array<[keyof T, T[keyof T]]>;

  sourceEntries.forEach(([key, value]) => {
    if (value !== undefined) {
      result[key] = value;
    }
  });

  return result;
};

export const getDefaultOptionId = <OptionType extends unknown>(
  prefix: string,
  option: OptionType,
  options: readonly OptionType[],
): string => {
  const index = options.indexOf(option);
  if (index < -1) {
    throw new Error(
      "getDefaultOptionId called with incompatible option, options arguments",
    );
  }

  return `${prefix}-option-${index}`;
};
