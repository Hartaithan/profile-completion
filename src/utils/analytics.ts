import type posthog from "posthog-js";

type PostHog = typeof posthog;
let instance: PostHog | null = null;

const load = async (): Promise<PostHog> => {
  if (instance) return instance;
  const { default: posthog } = await import("posthog-js");
  instance = posthog;
  return instance;
};

export const init = async () => {
  if (!import.meta.env.PROD) return;
  const posthog = await load();
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_URL + "/payload",
    ui_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: "identified_only",
    defaults: "2026-01-30",
  });
};

type CaptureParams = Parameters<PostHog["capture"]>;

export const capture = async (...params: CaptureParams) => {
  if (!import.meta.env.PROD) return;
  const posthog = await load();
  const [event, ...rest] = params;
  posthog.capture("pr-co-" + event, ...rest);
};

export default { init, capture };
