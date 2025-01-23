import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue?: T
): [T | undefined, (value: T) => void, () => void] {
  const [item, setItemState] = useState<T>();

  useEffect(() => {
    if (initialValue) {
      setItemState(initialValue);
    }

    const rawData = window.localStorage.getItem(key);

    if (rawData !== null) {
      try {
        const parsedData = JSON.parse(rawData) as T;
        setItem(parsedData);
      } catch (error) {
        setItem(rawData as T);
      }
    }
  }, []);

  // Probably a better way to do type checking
  function isString(value: any): value is string {
    return typeof value === "string";
  }

  function setItem(value: T) {
    const stringifiedValue = isString(value) ? value : JSON.stringify(value);

    setItemState(value);
    window.localStorage.setItem(key, stringifiedValue);
  }

  function removeItem() {
    window.localStorage.removeItem(key);
  }

  return [item, setItem, removeItem];
}
