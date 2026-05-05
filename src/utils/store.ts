import { setForage, setStorage } from "@/utils/local-storage";
import { toRaw } from "vue";

export const clone = <T>(value: T): T => {
  return structuredClone(toRaw(value));
};

export const persist = <T>(key: string, value: T, target: "storage" | "forage" = "storage"): T => {
  if (target === "storage") setStorage(key, value);
  else setForage(key, value);
  return value;
};

export const cloneAndPersist = <T>(
  key: string,
  value: T,
  target: "storage" | "forage" = "storage",
): T => {
  const cloned = clone(value);
  persist(key, cloned, target);
  return cloned;
};
