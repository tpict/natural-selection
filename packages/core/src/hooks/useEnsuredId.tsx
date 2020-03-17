import { useRef } from "react";

let runningRef = 1;

export const useEnsuredId = (
  providedId?: string,
  prefix = "natural-selection",
): string => {
  return useRef(providedId || `${prefix}-${runningRef++}`).current;
};
