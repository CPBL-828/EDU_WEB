import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/firstPages/UserSelectPage.vue"),
  },
  {
    path: "/:userKey/login",
    name: "login",
    component: () => import("../views/firstPages/LoginPage.vue"),
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
    path: "/t-manage/:subCategory",
    name: "t-manage",
    component: () => import("../views/teacherManage/TeacherManagePage.vue"),
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
  {
    path: "/s-manage/:subCategory",
    name: "s-manage",
    component: () => import("../views/studentManage/StudentManagePage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
