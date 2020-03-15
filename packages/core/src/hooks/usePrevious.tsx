import { MutableRefObject, useEffect, useRef } from "react";

export function usePrevious<T>(value: T): MutableRefObject<T | undefined> {
  const ref = useRef<T | undefined>();

  useEffect(() => {
    ref.current = value;
  });

  return ref;
}
