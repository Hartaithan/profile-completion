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
    // only basic events
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    // disable unnecessary features
    rageclick: false,
    disable_surveys: true,
    capture_dead_clicks: false,
    capture_performance: false,
    disable_session_recording: true,
    // disable feature flags and extra network requests
    advanced_disable_flags: true,
    advanced_disable_toolbar_metrics: true,
    advanced_disable_feature_flags_on_first_load: true,
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
