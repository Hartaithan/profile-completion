import posthog from "posthog-js";

export const init = () => {
  if (!import.meta.env.PROD) return;
  posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
    api_host: import.meta.env.VITE_URL + "/payload",
    ui_host: import.meta.env.VITE_POSTHOG_HOST,
    person_profiles: "identified_only",
    defaults: "2026-01-30",
  });
};

type CaptureParams = Parameters<(typeof posthog)["capture"]>;

export const capture = (...params: CaptureParams) => {
  if (!import.meta.env.PROD) return;
  const [event, ...rest] = params;
  posthog.capture("pr-co-" + event, ...rest);
};

export default { init, capture };
