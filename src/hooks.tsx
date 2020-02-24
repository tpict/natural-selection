import { useMemo } from "react";
import { CSSObject, useTheme } from "@emotion/react";
import { stripUnit } from "polished";
import {
  useMenuPlacement,
  MenuPlacementOptions,
  alignToControl,
} from "@natural-selection/core";

export const useMenuPlacementStyles = (
  isMenuOpen: boolean,
  menuRef: React.MutableRefObject<HTMLElement | null>,
  options: Omit<MenuPlacementOptions, "controlHeight">,
): CSSObject => {
  const theme = useTheme();

  const controlHeight: number = useMemo(() => {
    return (
      stripUnit(theme.fontSizes.root) *
      (theme.lineHeights.root +
        2 *
          (stripUnit(theme.space.control.border) +
            stripUnit(theme.space.control.padding)))
    );
  }, [theme]);

  const { placement, maxHeight } = useMenuPlacement(isMenuOpen, menuRef, {
    ...options,
    controlHeight,
  });

  return {
    [alignToControl(placement)]: "100%",
    maxHeight,
  };
};
