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
  const source = new EventSource(url, {
    fetch: (input, ini) => fetch(input, { ...ini, ...init }),
  });

  return new Promise((resolve, reject) => {
    let list: NullableCompletion[] = [];
    source.onmessage = (event) => {
      try {
        const data: CompletionEventData = JSON.parse(event.data);
        switch (data?.type) {
          case "progress":
            const completion = data?.completion || [];
            list = list.concat(completion);
            onProgress(data);
            break;
          case "complete": {
            const expires = data?.expires;
            resolve({ list, expires });
            source.close();
            break;
          }
          default:
            console.info("unable to recognize event type", data);
            source.close();
            break;
        }
      } catch (error) {
        console.error("error parsing SSE data", error);
        source.close();
        const message = readError(error);
        reject(message);
      }
    };

    source.onerror = (e) => {
      try {
        const event = e as MessageEvent;
        const data: CompletionErrorData = JSON.parse(event?.data);
        const message = data?.message ?? "Unknown SSE error";
        console.error("known SSE error", message, event);
        source.close();
        reject(message);
      } catch (error) {
        console.error("unknown SSE error", e, error);
        source.close();
        const message = readError(error);
        reject(message);
      }
    };

    if (signal) {
      const abortHandler = (event: Event) => {
        source.close();
        let message = "Unknown abort signal error";
        if (event.target instanceof AbortSignal) message = event.target.reason;
        signal.removeEventListener("abort", abortHandler);
        reject(message);
      };
      signal.addEventListener("abort", abortHandler);
    }
  });
};

export const API = {
  getProfile,
  getCompletion,
};
