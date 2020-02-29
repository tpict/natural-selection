import { defaultKeyDownHandler } from "@natural-selection/core";

export class UnreachableCaseError extends Error {
  constructor(val: never) {
    super(`Unreachable case: ${val}`);
  }
}

export const singleValueKeyHandler: typeof defaultKeyDownHandler = (
  event,
  state,
  handlers,
) => {
  if (event.key === "Backspace") {
    if ((event.target as HTMLInputElement).value) {
      return;
    }

    handlers.handleValueChange?.(null);
    event.preventDefault();
    return;
  }

  defaultKeyDownHandler(event, state, handlers);
};
