import type { Sizes } from "@/models/image";

export const getImageURL = (url: string | undefined, sizes?: Sizes): string => {
  if (!url) return "";
  if (typeof url !== "string") return url;
  if (url.trim().length === 0) return url;
  const parsed = new URL(url);
  if (sizes?.w) parsed.searchParams.set("w", sizes.w.toString());
  if (sizes?.h) parsed.searchParams.set("h", sizes.h.toString());
  return parsed.toString();
};
