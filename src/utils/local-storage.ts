import localforage from "localforage";

export const readStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error("unable to read storage value", key, error);
    return defaultValue;
  }
};

export const setStorage = <T>(key: string, value: T) => {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    console.error("unable to set storage value", key, error);
  }
};

export const readForage = async <T>(key: string, defaultValue: T): Promise<T> => {
  try {
    const value = await localforage.getItem<T>(key);
    return value ? JSON.parse(value as string) : defaultValue;
  } catch (error) {
    console.error("unable to read forage value", key, error);
    return defaultValue;
  }
};

export const setForage = async <T>(key: string, value: T) => {
  try {
    const serialized = JSON.stringify(value);
    localforage.setItem(key, serialized);
  } catch (error) {
    console.error("unable to set forage value", key, error);
  }
};
