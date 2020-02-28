import { useEffect } from "react";

export const useOpenMenuOnType = (
  inputValue: string,
  setMenuOpen: (isOpen: boolean) => void,
): void =>
  useEffect(() => {
    if (inputValue) {
      setMenuOpen(true);
    }
  }, [inputValue, setMenuOpen]);
