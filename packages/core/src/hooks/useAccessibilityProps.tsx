import { useContext } from "react";

import { AccessibilityContext, AccessibilityContextType } from "../context";

export const useAccessibilityProps = (): AccessibilityContextType =>
  useContext(AccessibilityContext);
