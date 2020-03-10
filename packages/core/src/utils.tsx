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
