import { useMemo } from "react";
import { CSSObject, useTheme } from "@emotion/react";
import { stripUnit } from "polished";
import {
  useMenuPlacement,
  MenuPlacementOptions,
  alignToControl,
} from "@natural-selection/core";

export const useMenuPlacementStyles = (
  menuRef: HTMLElement | null,
  options?: Partial<MenuPlacementOptions>,
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

  const { placement, maxHeight } = useMenuPlacement(menuRef, {
    ...options,
    controlHeight: options?.controlHeight ?? controlHeight,
    maxHeight: options?.maxHeight ?? theme.space.select.maxHeight,
    minHeight: options?.minHeight ?? theme.space.select.minHeight,
  });

  return {
    [alignToControl(placement)]: "100%",
    maxHeight,
  };
};
