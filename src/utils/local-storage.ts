export const readStorage = <T>(key: string, defaultValue: T) => {
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
