import { categoryInterface, defaultInterface } from "./lib/types";

export const STU_MAIN: categoryInterface[] = [
  {
    KEY: "M-PLACE",
    VALUE: "내 공간",
    ICON: "fa-solid fa-user",
    HAS_CHILD: true,
  },
  {
    KEY: "SCHEDULE",
    VALUE: "시간표",
    ICON: "fa-solid fa-chart-pie",
    HAS_CHILD: false,
  },
  {
    KEY: "LECTURE",
    VALUE: "수강 현황",
    ICON: "fa-solid fa-address-card",
    HAS_CHILD: true,
  },
  {
    KEY: "TEST",
    VALUE: "시험 현황",
    ICON: "fa-solid fa-highlighter",
    HAS_CHILD: true,
  },
];

export const STU_SUB: defaultInterface[] = [
  {
    KEY: "M-PLACE",
    VALUE: [
      { KEY: "INFO", VALUE: "내 정보" },
      { KEY: "SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "LECTURE",
    VALUE: [
      { KEY: "ATTENDANCE", VALUE: "출석 현황" },
      { KEY: "ASSIGNMENT", VALUE: "과제" },
    ],
  },
  {
    KEY: "TEST",
    VALUE: [
      { KEY: "SCHEDULE", VALUE: "시험 일정" },
      { KEY: "SCORE", VALUE: "성적" },
    ],
  },
];

export const PAR_MAIN: categoryInterface[] = [
  {
    KEY: "M-PLACE",
    VALUE: "내 공간",
    ICON: "fa-solid fa-user",
    HAS_CHILD: true,
  },
  {
    KEY: "SCHEDULE",
    VALUE: "자녀 시간표",
    ICON: "fa-solid fa-chart-pie",
    HAS_CHILD: false,
  },
  {
    KEY: "LECTURE",
    VALUE: "수강 현황",
    ICON: "fa-solid fa-address-card",
    HAS_CHILD: true,
  },
  {
    KEY: "TEST",
    VALUE: "시험 현황",
    ICON: "fa-solid fa-highlighter",
    HAS_CHILD: true,
  },
  {
    KEY: "CNA",
    VALUE: "상담 및 분석",
    ICON: "fa-solid fa-magnifying-glass-chart",
    HAS_CHILD: true,
  },
];

export const PAR_SUB: defaultInterface[] = [
  {
    KEY: "M-PLACE",
    VALUE: [
      { KEY: "INFO", VALUE: "내 정보" },
      { KEY: "SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "LECTURE",
    VALUE: [
      { KEY: "ATTENDANCE", VALUE: "출석 현황" },
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
  {
    KEY: "CNA",
    VALUE: [
      { KEY: "CONSULT", VALUE: "상담" },
      { KEY: "ANALYSIS", VALUE: "분석" },
    ],
  },
];

export const TEA_MAIN: categoryInterface[] = [
  {
    KEY: "NOTICE",
    VALUE: "공지",
    ICON: "fa-solid fa-bell",
    HAS_CHILD: true,
  },
  {
    KEY: "M-PLACE",
    VALUE: "내 공간",
    ICON: "fa-solid fa-user",
    HAS_CHILD: true,
  },
  {
    KEY: "S-MANAGE",
    VALUE: "학생 관리",
    ICON: "fa-solid fa-users",
    HAS_CHILD: true,
  },
  {
    KEY: "SCHEDULE",
    VALUE: "시간표 관리",
    ICON: "fa-solid fa-chart-pie",
    HAS_CHILD: true,
  },
  {
    KEY: "LECTURE",
    VALUE: "강의 관리",
    ICON: "fa-solid fa-address-card",
    HAS_CHILD: true,
  },
  {
    KEY: "TEST",
    VALUE: "시험 관리",
    ICON: "fa-solid fa-highlighter",
    HAS_CHILD: false,
  },
];

export const TEA_SUB: defaultInterface[] = [
  {
    KEY: "NOTICE",
    VALUE: [
      { KEY: "ALL", VALUE: "전체 공지" },
      { KEY: "MY", VALUE: "내 공지" },
    ],
  },
  {
    KEY: "M-PLACE",
    VALUE: [
      { KEY: "INFO", VALUE: "내 정보" },
      { KEY: "WORK", VALUE: "출근부" },
      { KEY: "SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "S-MANAGE",
    VALUE: [
      { KEY: "S-INFO", VALUE: "학생 정보" },
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
];

export const KYO_MAIN: categoryInterface[] = [
  {
    KEY: "ROOM",
    VALUE: "강의실 생성",
    ICON: "fa-solid fa-square-plus",
    HAS_CHILD: false,
  },
  {
    KEY: "NOTICE",
    VALUE: "공지 관리",
    ICON: "fa-solid fa-bell",
    HAS_CHILD: false,
  },
  {
    KEY: "T-MANAGE",
    VALUE: "강사 관리",
    ICON: "fa-solid fa-chalkboard-user",
    HAS_CHILD: true,
  },
  {
    KEY: "S-MANAGE",
    VALUE: "학생 관리",
    ICON: "fa-solid fa-users",
    HAS_CHILD: true,
  },
  {
    KEY: "SCHEDULE",
    VALUE: "시간표 관리",
    ICON: "fa-solid fa-chart-pie",
    HAS_CHILD: true,
  },
  {
    KEY: "LECTURE",
    VALUE: "강의 관리",
    ICON: "fa-solid fa-address-card",
    HAS_CHILD: true,
  },
  {
    KEY: "TEST",
    VALUE: "시험 관리",
    ICON: "fa-solid fa-highlighter",
    HAS_CHILD: false,
  },
];

export const KYO_SUB: categoryInterface[] = [
  {
    KEY: "T-MANAGE",
    VALUE: [
      { KEY: "T-INFO", VALUE: "강사 정보" },
      { KEY: "WORK", VALUE: "출근부" },
      { KEY: "T-SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "S-MANAGE",
    VALUE: [
      { KEY: "S-INFO", VALUE: "학생 정보" },
      { KEY: "CONSULT", VALUE: "상담" },
      { KEY: "ANALYSIS", VALUE: "분석" },
      { KEY: "S-SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "SCHEDULE",
    VALUE: [
      { KEY: "ALL", VALUE: "전체 시간표" },
      { KEY: "WRITE", VALUE: "시간표 작성" },
    ],
  },
  {
    KEY: "LECTURE",
    VALUE: [
      { KEY: "DETAIL", VALUE: "강의 조회" },
      { KEY: "ATTENDANCE", VALUE: "출결 현황" },
      { KEY: "ASSIGNMENT", VALUE: "과제" },
      { KEY: "REPORT", VALUE: "일지" },
    ],
  },
];

export const ETC_MAIN: categoryInterface[] = [
  {
    KEY: "ROOM",
    VALUE: "강의실 관리",
    ICON: "fa-solid fa-school",
    HAS_CHILD: false,
  },
  {
    KEY: "NOTICE",
    VALUE: "공지 관리",
    ICON: "fa-solid fa-bell",
    HAS_CHILD: false,
  },
  {
    KEY: "T-MANAGE",
    VALUE: "강사 관리",
    ICON: "fa-solid fa-chalkboard-user",
    HAS_CHILD: true,
  },
  {
    KEY: "S-MANAGE",
    VALUE: "학생 관리",
    ICON: "fa-solid fa-users",
    HAS_CHILD: true,
  },
  {
    KEY: "SCHEDULE",
    VALUE: "시간표 관리",
    ICON: "fa-solid fa-chart-pie",
    HAS_CHILD: false,
  },
  {
    KEY: "LECTURE",
    VALUE: "강의 관리",
    ICON: "fa-solid fa-address-card",
    HAS_CHILD: true,
  },
  {
    KEY: "TEST",
    VALUE: "시험 관리",
    ICON: "fa-solid fa-highlighter",
    HAS_CHILD: false,
  },
];

export const ETC_SUB: categoryInterface[] = [
  {
    KEY: "T-MANAGE",
    VALUE: [
      { KEY: "T-INFO", VALUE: "강사 정보" },
      { KEY: "WORK", VALUE: "출근부" },
      { KEY: "T-SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "S-MANAGE",
    VALUE: [
      { KEY: "S-INFO", VALUE: "학생 정보" },
      { KEY: "CONSULT", VALUE: "상담" },
      { KEY: "ANALYSIS", VALUE: "분석" },
      { KEY: "S-SUGGESTION", VALUE: "건의사항" },
    ],
  },
  {
    KEY: "LECTURE",
    VALUE: [
      { KEY: "L-INFO", VALUE: "강의 조회" },
      { KEY: "ATTENDANCE", VALUE: "출결 현황" },
      { KEY: "ASSIGNMENT", VALUE: "과제" },
      { KEY: "REPORT", VALUE: "일지" },
    ],
  },
];
