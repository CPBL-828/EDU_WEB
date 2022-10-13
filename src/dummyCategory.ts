import { categoryInterface } from "./lib/types";

export const TEA_MAIN: categoryInterface[] = [
  { KEY: "MINF", VALUE: "내 정보", ICON: "fa-solid fa-user" },
  { KEY: "STUDENT", VALUE: "학생 관리", ICON: "fa-solid fa-users" },
  { KEY: "SCHEDULE", VALUE: "시간표 관리", ICON: "fa-solid fa-chart-pie" },
  { KEY: "LECTURE", VALUE: "강의 관리", ICON: "fa-solid fa-address-card" },
  { KEY: "TEST", VALUE: "시험 관리", ICON: "fa-solid fa-highlighter" },
];

export const TEA_SUB: categoryInterface[] = [
  {
    KEY: "MINF",
    VALUE: [
      { KEY: "INFO", VALUE: "내 정보" },
      { KEY: "WORK", VALUE: "출근부" },
      { KEY: "SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "STUDENT",
    VALUE: [
      { KEY: "INFO", VALUE: "학생 정보" },
      { KEY: "CONSULT", VALUE: "상담" },
      { KEY: "ANALYSIS", VALUE: "분석" },
    ],
  },
  {
    KEY: "SCHEDULE",
    VALUE: [
      { KEY: "CURRENT", VALUE: "현재 시간표" },
      { KEY: "ASK", VALUE: "시간표 건의" },
      { KEY: "PLAN", VALUE: "계획서 작성" },
    ],
  },
  {
    KEY: "LECTURE",
    VALUE: [
      { KEY: "DETAIL", VALUE: "강의 상세" },
      { KEY: "ATTENDANCE", VALUE: "출석부" },
      { KEY: "CHECK", VALUE: "출석체크" },
      { KEY: "ASSIGNMENT", VALUE: "과제" },
    ],
  },
  {
    KEY: "TEST",
    VALUE: [
      { KEY: "SCHEDULE", VALUE: "시험 일정" },
      { KEY: "SCORE", VALUE: "성적 입력" },
    ],
  },
];
