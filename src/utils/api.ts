import { APP_NAME } from "@/constants/app";
import { getLoadedPostHog } from "@/utils/analytics";
import { createClient } from "@hartaithan/trophy-scout";

export const API = createClient({
  app: APP_NAME,
  analytics: () => getLoadedPostHog(),
});
