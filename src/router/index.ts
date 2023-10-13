import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/main/UserSelectPage.vue"),
  },
  {
    path: "/:userKey/login",
    name: "login",
    component: () => import("../views/main/LoginPage.vue"),
  },
  {
    path: "/main",
    name: "main",
    component: () => import("../views/main/MainPage.vue"),
  },
  {
    path: "/room",
    name: "room",
    component: () => import("../views/singleCategory/RoomManagePage.vue"),
  },
  {
    // 관리자의 전체 공지
    path: "/notice",
    name: "all-notice",
    component: () => import("../views/singleCategory/NoticePage.vue"),
  },
  // 관리자의 강사 관리
  {
    path: "/t-manage/:subCategory",
    name: "t-manage",
    component: () => import("../views/TeacherManagePage.vue"),
  },
  {
    path: "/notice/:noticeType",
    name: "notice",
    component: () => import("../views/singleCategory/NoticePage.vue"),
  },
  {
    path: "/m-place/:subCategory",
    name: "m-place",
    component: () => import("../views/MyPlacePage.vue"),
  },
  {
    path: "/s-manage/:subCategory",
    name: "s-manage",
    component: () => import("../views/StudentManagePage.vue"),
  },
  {
    path: "/cna/:subCategory",
    name: "cna",
    component: () => import("../views/StudentManagePage.vue"),
  },
  {
    path: "/schedule",
    name: "stu-schedule",
    component: () => import("../views/LectureManagePage.vue"),
  },
  {
    path: "/schedule/:subCategory",
    name: "schedule",
    component: () => import("../views/ScheduleManagePage.vue"),
  },
  {
    path: "/lecture/:subCategory",
    name: "lecture",
    component: () => import("../views/LectureManagePage.vue"),
  },
  {
    path: "/test",
    name: "test",
    component: () => import("../views/singleCategory/TestManagePage.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
