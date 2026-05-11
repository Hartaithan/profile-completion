import "@/main.css";
import "vue-sonner/style.css";

import App from "@/App.vue";
import { useCompletionStore } from "@/store/completion";
import analytics from "@/utils/analytics";
import { initDeviceDetection } from "@/utils/device";
import { createPinia } from "pinia";
import { createApp } from "vue";

initDeviceDetection();

const pinia = createPinia();
const app = createApp(App);

analytics.init();

app.use(pinia);
app.mount("#app");

const completion = useCompletionStore();
completion.init();
