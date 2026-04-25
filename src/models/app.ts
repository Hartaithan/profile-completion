interface ResponseBase {
  message: string;
}

export type Response<T = undefined> = ResponseBase & Partial<T>;

export interface CachedResponse {
  expires?: string;
}

export type Device = "desktop" | "mobile";

export type FetchStatus =
  | "initializing"
  | "idle"
  | "profile-loading"
  | "completion-loading"
  | "completed";
