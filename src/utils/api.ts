import type { CompletionResponse, FetchCompletionParams } from "@/models/completion";
import type { FetchProfileParams, ProfileResponse } from "@/models/profile";
import { getInit } from "@/utils/signature";

const statuses: Record<number, string> = {
  401: "Unauthorized",
  504: "The server took too long to respond. Please try again later",
};

const handleResponse = async (response: Response) => {
  if (statuses[response.status]) throw new Error(statuses[response.status]);
  const data = await response.json();
  if (!response.ok) throw new Error(data?.message ?? "Unknown error");
  return data;
};

const getProfile = async (params: FetchProfileParams): Promise<ProfileResponse> => {
  const { id, signal } = params;
  const url = new URL(import.meta.env.VITE_API_URL);
  url.pathname += "/" + id;
  url.pathname += "/profile";
  const init = await getInit({ method: "GET", url, signal });
  const response = await fetch(url, init);
  return await handleResponse(response);
};

const getCompletion = async (params: FetchCompletionParams): Promise<CompletionResponse> => {
  const { id, signal } = params;
  const url = new URL(import.meta.env.VITE_API_URL);
  url.pathname += "/" + id;
  url.pathname += "/completion";
  const init = await getInit({ method: "GET", url, signal });
  const response = await fetch(url, init);
  return await handleResponse(response);
};

export const API = {
  getProfile,
  getCompletion,
};
