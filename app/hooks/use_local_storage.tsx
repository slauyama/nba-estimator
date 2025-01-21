import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initalValue: T
): [T, (value: T) => void, () => void] {
  const [item, setItemState] = useState<T>(initalValue);

  useEffect(() => {
    const rawData = window.localStorage.getItem(key);

    if (rawData !== null) {
      try {
        const parsedData = JSON.parse(rawData) as T;
        setItem(parsedData);
      } catch (error) {}
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
