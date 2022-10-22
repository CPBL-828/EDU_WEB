import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/UserSelectPage.vue"),
  },
  {
    path: "/:userKey/login",
    name: "login",
    component: () => import("../views/LoginPage.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/MainPage.vue"),
  },
  {
    path: "/m-place",
    name: "myplace",
    component: () => import("../views/MainPage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
