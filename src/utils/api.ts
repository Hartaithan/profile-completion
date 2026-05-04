import type {
  CompletionErrorData,
  CompletionEventData,
  CompletionResponse,
  FetchCompletionParams,
  NullableCompletion,
} from "@/models/completion";
import type { FetchProfileParams, ProfileResponse } from "@/models/profile";
import { readError } from "@/utils/error";
import { getInit } from "@/utils/signature";
import { EventSource } from "eventsource";

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
  const { id, onProgress, signal } = params;

  const url = new URL(import.meta.env.VITE_API_URL);
  url.pathname += "/" + id;
  url.pathname += "/completion";

  const init = await getInit({ method: "GET", url });

  if (signal?.aborted) return Promise.reject(signal.reason);

  const source = new EventSource(url, {
    fetch: (input, ini) => fetch(input, { ...ini, ...init, signal }),
  });

  return new Promise((resolve, reject) => {
    let list: NullableCompletion[] = [];

    const cleanup = () => {
      source.close();
      signal?.removeEventListener("abort", abortHandler);
    };

    const abortHandler = (event: Event) => {
      cleanup();
      const reason = (event.target as AbortSignal)?.reason || "Aborted";
      reject(reason);
    };

    if (signal) {
      signal.addEventListener("abort", abortHandler);
    }

    source.onmessage = (event) => {
      try {
        const data: CompletionEventData = JSON.parse(event.data);
        switch (data?.type) {
          case "progress": {
            const completion = data?.completion ?? [];
            list = list.concat(completion);
            onProgress(data);
            break;
          }
          case "complete": {
            cleanup();
            resolve({ list, progress: data?.progress, expires: data?.expires });
            break;
          }
          default:
            console.info("unable to recognize event type", data);
            cleanup();
            break;
        }
      } catch (error) {
        console.error("error parsing SSE data", error);
        cleanup();
        reject(readError(error));
      }
    };

    source.onerror = (e) => {
      if (signal?.aborted) return;
      try {
        const event = e as MessageEvent;
        const data: CompletionErrorData = JSON.parse(event?.data);
        const message = data?.message ?? "Unknown SSE error";
        console.error("known SSE error", message, event);
        cleanup();
        reject(message);
      } catch (error) {
        console.error("unknown SSE error", e, error);
        cleanup();
        const message = readError(error);
        reject(message);
      }
    };
  });
};

export const API = {
  getProfile,
  getCompletion,
};
