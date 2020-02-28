import { useState, useCallback } from "react";

export const useCallbackRef = <T extends HTMLElement>(): {
  current: T | null;
  callback: (el: T | null) => void;
} => {
  const [el, setEl] = useState<T | null>(null);

  return {
    current: el,
    callback: useCallback(setEl, []),
  };
};
