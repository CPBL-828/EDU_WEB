import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import VueClickAwayPlugin from "vue3-click-away";

createApp(App).use(router).use(VueClickAwayPlugin).mount("#app");
