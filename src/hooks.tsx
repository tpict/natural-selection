import { CSSObject } from "@emotion/react";

import {
  useMenuPlacement,
  MenuPlacementOptions,
} from "../packages/core/src/hooks";
import { alignToControl } from "../packages/core/src/react-select/menu";

export const useMenuPlacementStyles = (
  isMenuOpen: boolean,
  menuRef: React.MutableRefObject<HTMLElement | null>,
  options: MenuPlacementOptions,
): CSSObject => {
  const { placement, maxHeight } = useMenuPlacement(
    isMenuOpen,
    menuRef,
    options,
  );
  return {
    [alignToControl(placement)]: "100%",
    maxHeight,
  };
};
