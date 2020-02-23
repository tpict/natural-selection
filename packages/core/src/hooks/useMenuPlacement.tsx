import { useLayoutEffect, useState } from "react";

import { getMenuPlacement, MenuState } from "../react-select/menu";

import { usePrevious } from "./index";

export type MenuPlacementOptions = {
  maxHeight: number;
  minHeight: number;
  controlHeight: number;
  placement?: "top" | "bottom";
  shouldScroll?: boolean;
  isFixedPosition?: boolean;
};

export const useMenuPlacement = (
  isMenuOpen: boolean,
  menuRef: React.MutableRefObject<HTMLElement | null>,
  {
    maxHeight,
    minHeight,
    controlHeight,
    placement = "bottom",
    shouldScroll = true,
    isFixedPosition = false,
  }: MenuPlacementOptions,
): MenuState => {
  const prevMenuOpen = usePrevious(isMenuOpen);
  const menuJustOpened = isMenuOpen && !prevMenuOpen;

  const [menuPlacement, setMenuPlacement] = useState<MenuState>({
    maxHeight: 300,
    placement: "bottom",
  });

  useLayoutEffect(() => {
    if (!menuRef.current) {
      return;
    }

    if (!menuJustOpened) {
      return;
    }

    setMenuPlacement(
      getMenuPlacement({
        maxHeight,
        minHeight,
        menuEl: menuRef.current,
        placement,
        shouldScroll,
        isFixedPosition,
        theme: { spacing: { controlHeight } },
      }),
    );
    // refs aren't an effect dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    menuJustOpened,
    maxHeight,
    minHeight,
    placement,
    shouldScroll,
    isFixedPosition,
    controlHeight,
  ]);

  return menuPlacement;
};
