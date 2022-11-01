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
    // 관리자의 전체 공지
    path: "/notice",
    name: "all-notice",
    component: () => import("../views/NoticePage.vue"),
  },
  // 관리자의 강사 관리
  {
    path: "/teacher/:subCategory",
    name: "teacher-info",
    component: () => import("../views/TeacherManagePage.vue"),
  },
  {
    path: "/notice/:noticeType",
    name: "notice",
    component: () => import("../views/NoticePage.vue"),
  },
  {
    path: "/m-place/:subCategory",
    name: "m-place",
    component: () => import("../views/MyPlacePage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
