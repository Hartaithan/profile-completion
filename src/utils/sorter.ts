import type { Completion } from "@/models/completion";
import type { SortDirection } from "@/models/filters";
import type { AcceptableValue } from "reka-ui";

export const getSorter = (value: AcceptableValue) => {
  if (typeof value !== "string") return null;
  const [field, direction] = value.split(":") as [keyof Completion, SortDirection];
  return { field, direction };
};
