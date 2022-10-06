import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/UserSelectPage.vue"),
  },
  {
    path: "/:userKey",
    name: "login",
    component: () => import("../views/LoginPage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
