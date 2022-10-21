import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "v-calendar/dist/style.css";
import VCalendarLibrary from "v-calendar";
import VueClickAwayPlugin from "vue3-click-away";

createApp(App)
  .use(router)
  .use(VCalendarLibrary, {})
  .use(VueClickAwayPlugin)
  .mount("#app");
