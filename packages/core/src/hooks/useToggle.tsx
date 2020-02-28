import { Dispatch, SetStateAction, useCallback, useState } from "react";

export const useToggle = (
  initialState: boolean,
): [boolean, Dispatch<SetStateAction<boolean>>, () => void] => {
  const [state, setState] = useState<boolean>(initialState);
  return [state, setState, useCallback(() => setState(state => !state), [])];
};
