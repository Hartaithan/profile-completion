export type Device = "desktop" | "mobile";

export type FetchStatus =
  | "initializing"
  | "idle"
  | "profile-loading"
  | "completion-loading"
  | "completed";
