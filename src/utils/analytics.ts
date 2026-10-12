import { APP_NAME } from "@/constants/app";
import type posthog from "posthog-js";
import type { PostHogConfig } from "posthog-js";

type PostHogModule = typeof posthog;
type PostHog = Parameters<NonNullable<PostHogConfig["loaded"]>>[0];

let module: PostHogModule | null = null;
let instance: PostHog | null = null;

const load = async (): Promise<PostHogModule> => {
  if (module) return module;
  const { default: posthog } = await import("posthog-js");
  module = posthog;
  return module;
};

export const getLoadedPostHog = () => instance;

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
    capture_exceptions: {
      capture_unhandled_errors: true,
      capture_unhandled_rejections: true,
    },
    loaded: (loaded) => {
      loaded.register({ app: APP_NAME, app_version: __APP_VERSION__ });
      instance = loaded;
    },
  });
};

export const capture = (...params: Parameters<PostHog["capture"]>) => {
  return getLoadedPostHog()?.capture(...params);
};
