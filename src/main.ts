import "@/main.css";
import "vue-sonner/style.css";

import App from "@/App.vue";
import { useCompletionStore } from "@/store/completion";
import { getLoadedPostHog, init } from "@/utils/analytics";
import { initDeviceDetection } from "@/utils/device";
import { createPinia } from "pinia";
import { createApp } from "vue";

initDeviceDetection();

const pinia = createPinia();
const app = createApp(App);

init();

app.config.errorHandler = (error) => {
  getLoadedPostHog()?.captureException(error);
  console.error("critical error", error);
};

app.use(pinia);
app.mount("#app");

const completion = useCompletionStore();
completion.init();
