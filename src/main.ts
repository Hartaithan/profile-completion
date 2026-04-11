import "./main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { useCompletionStore } from "./store/completion";
import { initDeviceDetection } from "./utils/device";

initDeviceDetection();

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount("#app");

const completion = useCompletionStore();
completion.init();
