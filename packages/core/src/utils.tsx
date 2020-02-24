import React from "react";

export const simpleMemo: <T>(fn: T) => T = React.memo;

export const noop = (): void => {}; // eslint-disable-line @typescript-eslint/no-empty-function

export const preventDefault = (event: React.SyntheticEvent): void =>
  event.preventDefault();
