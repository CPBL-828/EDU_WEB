import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import router from "./router";
import "v-calendar/dist/style.css";
import VCalendarLibrary from "v-calendar";
import VueClickAwayPlugin from "vue3-click-away";

createApp(App)
  .use(store)
  .use(router)
  .use(VCalendarLibrary, {})
  .use(VueClickAwayPlugin)
  .mount("#app");
