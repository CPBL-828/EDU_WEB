import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/UserSelectPage.vue"),
  },
  {
    path: "/login:userKey",
    name: "login",
    component: () => import("../views/LoginPage.vue"),
  },
  {
    path: "/main-:userType",
    name: "main",
    component: () => import("../views/MainPage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
