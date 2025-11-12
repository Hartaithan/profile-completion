import localforage from "localforage";

export const readStorage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const value = await localforage.getItem<T>(key);
    return value ? JSON.parse(value as string) : defaultValue;
  } catch (error) {
    console.error("unable to read storage value", key, error);
    return defaultValue;
  }
};

export const setStorage = async <T>(key: string, value: T) => {
  try {
    const serialized = JSON.stringify(value);
    localforage.setItem(key, serialized);
  } catch (error) {
    console.error("unable to set storage value", key, error);
  }
};
