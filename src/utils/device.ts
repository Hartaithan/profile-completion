export const isTouchDevice = () => {
  const hasWindow = typeof window !== "undefined";
  const hasTouch = "ontouchstart" in window || navigator?.maxTouchPoints > 0;
  return hasWindow && hasTouch;
};
