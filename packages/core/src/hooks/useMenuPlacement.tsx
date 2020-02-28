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
  menuRef: HTMLElement | null,
  {
    maxHeight,
    minHeight,
    controlHeight,
    placement = "bottom",
    shouldScroll = true,
    isFixedPosition = false,
  }: MenuPlacementOptions,
): MenuState => {
  const prevRef = usePrevious(menuRef);
  const menuJustOpened = menuRef && !prevRef;

  const [menuPlacement, setMenuPlacement] = useState<MenuState>({
    maxHeight,
    placement,
  });

  useLayoutEffect(() => {
    if (!menuJustOpened || !menuRef) {
      return;
    }

    setMenuPlacement(
      getMenuPlacement({
        maxHeight,
        minHeight,
        menuEl: menuRef,
        placement,
        shouldScroll,
        isFixedPosition,
        theme: { spacing: { controlHeight } },
      }),
    );
  }, [
    menuJustOpened,
    menuRef,
    maxHeight,
    minHeight,
    placement,
    shouldScroll,
    isFixedPosition,
    controlHeight,
  ]);

  return menuPlacement;
};
