import "./main.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import App from "./App.vue";
import { useCompletionStore } from "./store/completion";
import { useGoalStore } from "./store/goal";
import { initDeviceDetection } from "./utils/device";

initDeviceDetection();

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);

const goal = useGoalStore();
const completion = useCompletionStore();
await Promise.all([goal.init(), completion.init()]);

app.mount("#app");
