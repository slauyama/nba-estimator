import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T) => void, () => void] {
  const [item, setItemState] = useState<T>();
  // Probably a better way to do type checking
  function isString(value: unknown): value is string {
    return typeof value === "string";
  }

  const setItem = useCallback(
    (value: T) => {
      const stringifiedValue = isString(value) ? value : JSON.stringify(value);

      setItemState(value);
      window.localStorage.setItem(key, stringifiedValue);
    },
    [key, setItemState]
  );

  useEffect(() => {
    if (initialValue) {
      setItemState(initialValue);
    }

    const rawData = window.localStorage.getItem(key);

    if (rawData !== null) {
      try {
        const parsedData = JSON.parse(rawData) as T;
        setItem(parsedData);
      } catch {
        setItem(rawData as T);
      }
    }
  }, [initialValue, key, setItem]);

  function removeItem() {
    window.localStorage.removeItem(key);
  }

  return [item, setItem, removeItem];
}
