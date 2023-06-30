<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from "vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import {
  adminInterface,
  consultInterface,
  defaultInterface,
  teacherInterface,
} from "../../lib/types";
import { ApiClient } from "../../axios";
import common from "../../lib/common";
import { KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import PaginationComponent from "../fixed/PaginationComponent.vue";
import DataListComponent from "../custom/DataListComponent.vue";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import SelectListComponent from "../custom/SelectListComponent.vue";

export default defineComponent({
  name: "ConsultComponent",
  props: {
    adminState: {
      types: Boolean as PropType<boolean>,
      required: true,
    },
  },
  components: {
    SelectListComponent,
    ModalPopupComponent,
    DataListComponent,
    PaginationComponent,
    DropBoxComponent,
  },
  setup(props) {
    const router = useRouter();
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const selectTeacherState = ref(false);
    const selectSection = ref<string | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const adminInfo = ref<adminInterface | undefined>(undefined);
    const student = ref<defaultInterface>({ KEY: "", VALUE: "" });
    //TODO 일정 입력, 상담 예정 나누기
    const consultType = ref<string>("");
    const studentList = ref<Array<defaultInterface>>([]);

    const date = ref<string>("");
    const time = ref<string | undefined>(undefined);
    const typeList: defaultInterface[] = [
      { KEY: "STUDENT", VALUE: "학생" },
      { KEY: "PARENT", VALUE: "학부모" },
      { KEY: "ENTRANCE", VALUE: "입시" },
      { KEY: "SCORE", VALUE: "성적" },
      { KEY: "ETC", VALUE: "기타" },
    ];

    //상담 일정 입력
    const inputDate = ref<Date | undefined>(undefined);
    const inputTime = ref<Date>(new Date());
    const inputType = ref<string>("");
    const inputDateCalendarState = ref(false);
    const inputTimeCalendarState = ref(false);
    const viewInput = ref(false);

    //상담 예정 현황
    const planDate = ref<Date | undefined>(undefined);
    const planDateCalendarState = ref(false);
    const planConsultList = ref<Array<consultInterface>>([]);
    const showPlanConsultList = ref<Array<consultInterface>>([]);
    const planTotalCnt = ref<number>(0);
    const planPage = ref<number>(0);
    const planCurrentPage = ref<number>(1);
    const planListCnt: number = 4;
    const planDetailHeader = ref<consultInterface | undefined>(undefined);
    const planDetailContent = ref<string>("");
    const planTypeHolder = ref<string>("상담 유형");
    const planNameHolder = ref<string>("학생명");

    //상담 목록 조회
    const listDate = ref<Date | undefined>(undefined);
    const listDateCalendarState = ref(false);
    const listConsultList = ref<Array<consultInterface>>([]);
    const listTotalCnt = ref<number | undefined>(undefined);
    const listHeader: defaultInterface[] = [
      { KEY: "date", VALUE: "상담 일자" },
      { KEY: "time", VALUE: "상담 시간" },
      { KEY: "type", VALUE: "상담 유형" },
      { KEY: "student", VALUE: "상담 학생" },
      { KEY: "teacher", VALUE: "상담 강사" },
    ];
    const listConsultDetail = ref<consultInterface | undefined>(undefined);
    const listTypeHolder = ref<string>("상담 유형");
    const listNameHolder = ref<string>("학생명");

    const goBack = () => {
      common.removeItem(KEYS.ST);
      router.go(0);
    };

    const selectMe = async () => {
      selectTeacherState.value = true;

      let data = { teacherKey: "" };
      common.setItem(KEYS.ST, common.makeJson(data));

      viewInput.value = true;

      await setStudentList();
      await setConsultList();
    };

    const selectTeacher = async (t: teacherInterface) => {
      selectTeacherState.value = true;
      teacherInfo.value = t;
      common.setItem(KEYS.ST, common.makeJson(teacherInfo.value));

      await setStudentList();
      await setConsultList();
    };

    const setStudentList = async () => {
      let data = {
        userKey: teacherInfo.value
          ? teacherInfo.value?.teacherKey
          : adminInfo.value
          ? adminInfo.value.adminKey
          : "",
        search: "",
        lectureKey: "",
        parentKey:
          common.getItem(KEYS.UK).userKey === USER_KEY.PAR
            ? common.getItem(KEYS.LU).parentKey
            : "",
      };

      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          for (let i = 0; i < result.count; i++) {
            studentList.value[i] = {
              KEY: result.resultData[i].studentKey,
              VALUE: result.resultData[i].name,
            };
          }
        }
      }
    };

    const setConsultList = async () => {
      let data = {
        userKey: teacherInfo.value
          ? teacherInfo.value?.teacherKey
          : adminInfo.value
          ? adminInfo.value.adminKey
          : "",
        studentKey: student.value.KEY,
        search: consultType.value,
        date: date.value,
      };

      const result = await ApiClient(
        "/info/getConsultList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          if (!selectSection.value) {
            result.resultData.map((item: consultInterface) => {
              if (item.content) {
                listConsultList.value.push(item);
              } else {
                planConsultList.value.push(item);
              }
            });

            planConsultList.value.sort(
              (a: consultInterface, b: consultInterface): number =>
                +new Date(a.consultDate.substring(0, 10)) -
                +new Date(b.consultDate.substring(0, 10))
            );

            listConsultList.value.sort(
              (a: consultInterface, b: consultInterface): number =>
                +new Date(b.consultDate.substring(0, 10)) -
                +new Date(a.consultDate.substring(0, 10))
            );
          } else if (selectSection.value === "plan") {
            planConsultList.value = [];
            result.resultData.map((item: consultInterface) => {
              if (!item.content) {
                planConsultList.value.push(item);
              }
            });
          } else if (selectSection.value === "list") {
            listConsultList.value = [];
            result.resultData.map((item: consultInterface) => {
              if (item.content) {
                listConsultList.value.push(item);
              }
            });
          }
        } else {
          if (selectSection.value === "plan") planConsultList.value = [];
          else if (selectSection.value === "list") listConsultList.value = [];
        }
      }

      listTotalCnt.value = listConsultList.value.length;
      planTotalCnt.value = planConsultList.value.length;
      if (planTotalCnt.value > planListCnt) {
        showPlanConsultList.value = planConsultList.value.slice(0, planListCnt);
        planPage.value = Math.ceil(planTotalCnt.value / planListCnt);
      } else {
        showPlanConsultList.value = planConsultList.value;
        planPage.value = 0;
      }
    };

    const openCalendar = (s: string, t: string) => {
      if (s === "input") {
        if (t === "date") {
          inputDate.value = new Date();
          inputDateCalendarState.value = !inputDateCalendarState.value;
        } else {
          inputTimeCalendarState.value = !inputTimeCalendarState.value;
        }
      } else if (s === "plan") {
        planDate.value = new Date();
        planDateCalendarState.value = !planDateCalendarState.value;
      } else {
        listDateCalendarState.value = !listDateCalendarState.value;
      }
    };

    const selectInputType = (t: defaultInterface) => {
      inputType.value = (t.VALUE as string) + " 상담";
    };

    const selectType = async (t: defaultInterface) => {
      consultType.value = t.VALUE as string;

      if (selectSection.value === "plan")
        planTypeHolder.value = t.VALUE as string;
      if (selectSection.value === "list")
        listTypeHolder.value = t.VALUE as string;

      await setConsultList();
    };

    const selectInputStudent = (s: defaultInterface) => {
      student.value.KEY = s.KEY;
      student.value.VALUE = s.VALUE as string;
    };

    const selectStudent = async (s: defaultInterface) => {
      student.value.KEY = s.KEY;
      student.value.VALUE = s.VALUE as string;

      if (selectSection.value === "plan")
        planNameHolder.value = s.VALUE as string;
      if (selectSection.value === "list")
        listNameHolder.value = s.VALUE as string;

      await setConsultList();
    };

    const selectPage = (p: number) => {
      planCurrentPage.value = p;
    };

    const changePage = (p: number) => {
      if (p === 1) planCurrentPage.value = planCurrentPage.value + 1;
      else planCurrentPage.value = planCurrentPage.value - 1;
    };

    const insertConsult = async () => {
      if (!date.value) {
        window.alert("상담 날짜를 입력해 주세요.");
        return false;
      } else if (!time.value) {
        window.alert("상담 시간을 입력해 주세요.");
        return false;
      } else if (!inputType.value) {
        window.alert("상담 유형을 선택해 주세요.");
        return false;
      } else if (!student.value) {
        window.alert("학생을 선택해 주세요.");
        return false;
      }

      let data = {
        studentKey: student.value.KEY,
        studentName: student.value.VALUE,
        targetKey: teacherInfo.value
          ? teacherInfo.value?.teacherKey
          : adminInfo.value?.adminKey,
        targetName: props.adminState ? "관리자" : teacherInfo.value?.name,
        consultDate:
          date.value && time.value ? date.value + time.value + ":00" : "",
        content: "",
        consultType: inputType.value,
      };

      const result = await ApiClient(
        "/info/createConsultPlan/",
        common.makeJson(data)
      );

      if (result.chunbae === RESULT_KEY.CREATE) {
        router.go(0);
      }
    };

    const openInsertPopup = (h: consultInterface) => {
      selectSection.value = "plan";
      planDetailHeader.value = h;
      store.commit("setModalState", true);
    };

    const doInput = async () => {
      if (!planDetailContent.value) {
        window.alert("상담 내용을 입력해 주세요.");
        return false;
      }

      let data = {
        consultKey: planDetailHeader.value?.consultKey,
        content: planDetailContent.value,
      };

      const result = await ApiClient(
        "/info/createConsult/",
        common.makeJson(data)
      );

      if (result.chunbae === RESULT_KEY.CREATE) {
        window.alert("상담 결과를 성공적으로 입력했습니다.");
        router.go(0);
      }
    };

    const showConsultDetail = (i: consultInterface) => {
      selectSection.value = "list";
      listConsultDetail.value = i;
      store.commit("setModalState", true);
      document.getElementById("consult")?.scrollTo(0, 0);
    };

    const deleteConsult = async () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        let data = {
          consultKey: listConsultDetail.value?.consultKey,
        };

        const result = await ApiClient(
          "/info/deleteConsult/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.DELETE) {
            window.alert("성공적으로 삭제했습니다.");
            router.go(0);
          }
        } else {
          window.alert("삭제를 실패했습니다.");
        }
      } else {
        return false;
      }
    };

    const removeFilter = async (s: string) => {
      consultType.value = "";
      student.value = { KEY: "", VALUE: "" };

      if (s === "plan") {
        selectSection.value = "plan";

        planDate.value = undefined;

        //placeholder 초기화
        planTypeHolder.value = "상담 유형";
        planNameHolder.value = "학생명";

        await setConsultList();
      } else if (s === "list") {
        selectSection.value = "list";

        listDate.value = undefined;

        listTypeHolder.value = "상담 유형";
        listNameHolder.value = "학생명";

        await setConsultList();
      }
    };

    watch(
      () => inputDate.value,
      () => {
        date.value =
          inputDate.value?.toLocaleDateString().substring(6, 11) +
          "-" +
          inputDate.value?.toLocaleDateString().substring(3, 5) +
          "-" +
          inputDate.value?.toLocaleDateString().substring(0, 2) +
          "T";
      }
    );

    watch(
      () => planDate.value,
      async () => {
        date.value = planDate.value?.toISOString().substring(0, 10) as string;
        selectSection.value = "plan";
        await setConsultList();
      }
    );

    watch(
      () => listDate.value,
      async () => {
        date.value = listDate.value?.toISOString().substring(0, 10) as string;
        selectSection.value = "list";
        await setConsultList();
      }
    );

    watch(
      () => inputTime.value,
      () => {
        time.value = inputTime.value?.toTimeString().substring(0, 5);
      }
    );

    watch(
      () => planCurrentPage.value,
      () => {
        if (planConsultList.value.length > 0) {
          showPlanConsultList.value = planConsultList.value?.slice(
            planListCnt * planCurrentPage.value - planListCnt,
            planListCnt * planCurrentPage.value
          ) as [];
        }
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherInfo.value = common.getItem(KEYS.LU) as teacherInterface;
        viewInput.value = true;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.PAR) {
        const child = await common.setChildren(
          common.getItem(KEYS.LU).parentKey
        );

        if (child) {
          student.value = {
            KEY: child.studentKey,
            VALUE: child.name,
          };
        }
      } else if (props.adminState) {
        adminInfo.value = common.getItem(KEYS.LU) as adminInterface;
      }

      if (common.getItem(KEYS.ST)) {
        if (common.getItem(KEYS.ST).teacherKey) {
          teacherInfo.value = common.getItem(KEYS.ST);
          selectTeacherState.value = true;
        } else {
          adminInfo.value = common.getItem(KEYS.LU) as adminInterface;
          selectTeacherState.value = true;
        }
      }

      await setStudentList();
      await setConsultList();
    });

    onUnmounted(() => {
      common.removeItem(KEYS.ST);
    });

    return {
      category,
      selectTeacherState,
      selectSection,
      teacherInfo,
      adminInfo,
      studentList,
      date,
      time,
      typeList,
      viewInput,
      inputDate,
      inputTime,
      inputDateCalendarState,
      inputTimeCalendarState,
      planDate,
      planDateCalendarState,
      planConsultList,
      showPlanConsultList,
      planTotalCnt,
      planPage,
      planCurrentPage,
      planDetailHeader,
      planDetailContent,
      planTypeHolder,
      planNameHolder,
      listDate,
      listDateCalendarState,
      listConsultList,
      listTotalCnt,
      listHeader,
      listConsultDetail,
      listTypeHolder,
      listNameHolder,
      goBack,
      selectMe,
      selectTeacher,
      openCalendar,
      selectInputType,
      selectType,
      selectInputStudent,
      selectStudent,
      selectPage,
      changePage,
      insertConsult,
      openInsertPopup,
      doInput,
      showConsultDetail,
      deleteConsult,
      removeFilter,
    };
  },
});
</script>

<template>
  <section class="current-schedule" v-if="adminState && !selectTeacherState">
    <div class="current-schedule">
      <div class="current-schedule-section">
        <div class="current-schedule-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="current-schedule-section-body" :style="{ height: '800px' }">
          <div class="current-schedule-section-body-today">
            <i class="fa-regular fa-calendar"></i> TODAY :
            {{ new Date().toISOString().substring(0, 4) }}년
            {{ new Date().toISOString().substring(5, 7) }}월
            {{ new Date().toISOString().substring(8, 10) }}일
            {{ new Date().toString().substring(0, 4) }}
          </div>
          <div class="current-schedule-section-body-lecture" v-if="adminState">
            <select-list-component
              v-if="!selectTeacherState"
              list-type="TEA"
              @selectTeacher="selectTeacher"
              @selectMe="selectMe"
              is-consult="Y"
            ></select-list-component>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="consult" id="consult" v-else>
    <div class="consult">
      <span class="go-back" @click="goBack" v-if="adminState"
        >강사 다시 선택하기</span
      >
      <div class="consult-input-section" v-if="viewInput">
        <div class="consult-input-section-tag">상담 일정 입력</div>
        <div class="consult-input-section-body">
          <span class="consult-input-section-body-title">
            상담 정보를 추가해주세요.
          </span>
          <div
            class="consult-input-section-body-item"
            @click="selectSection === ''"
          >
            <div class="consult-input-section-body-item-date">
              <i class="fa-solid fa-filter"></i>
              {{ inputDate ? inputDate?.toDateString() : "상담 날짜" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('input', 'date')"
              ></i>
              <v-date-picker
                class="calendar-date"
                v-if="inputDateCalendarState"
                mode="date"
                v-model="inputDate"
                :minute-increment="5"
              />
            </div>
            <div class="sap"></div>
            <div class="consult-input-section-body-item-time">
              <i class="fa-solid fa-clock"></i>
              {{ time ? time : "상담 시간" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('input', 'time')"
              ></i>
              <v-date-picker
                class="calendar-time"
                v-if="inputTimeCalendarState"
                mode="time"
                v-model="inputTime"
                :minute-increment="5"
                is24hr
              />
            </div>
            <div class="sap"></div>
            <div class="consult-input-section-body-item-type">
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
                row-height="40px"
                :select-list="typeList"
                @selectValue="selectInputType"
              ></drop-box-component>
            </div>
            <div class="sap"></div>
            <div class="consult-input-section-body-item-name">
              <drop-box-component
                :select-list="studentList"
                placeholder="학생명"
                row-width="160px"
                row-height="40px"
                @selectValue="selectInputStudent"
              ></drop-box-component>
            </div>
            <div
              class="consult-input-section-body-item-insert"
              @click="insertConsult"
            >
              상담 일정 추가 하기
            </div>
          </div>
        </div>
      </div>

      <div
        class="consult-plan-section"
        :style="{
          top: !viewInput ? '39px' : '',
        }"
      >
        <div class="consult-plan-section-tag">상담 예정 현황</div>
        <div class="consult-plan-section-body">
          <span class="consult-plan-section-body-title">
            상담이 완료되면 결과를 입력해 주세요.
          </span>
          <div class="consult-plan-section-body-item">
            <div class="consult-plan-section-body-item-date">
              <i class="fa-solid fa-filter"></i>
              {{ planDate ? planDate?.toDateString() : "상담 날짜" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('plan', 'date')"
              ></i>
              <v-date-picker
                class="calendar-date"
                v-if="planDateCalendarState"
                mode="date"
                v-model="planDate"
                :minute-increment="5"
              />
            </div>
            <div class="sap"></div>
            <div
              class="consult-input-section-body-item-type"
              @click="selectSection = 'plan'"
            >
              <drop-box-component
                :placeholder="planTypeHolder"
                row-width="160px"
                row-height="40px"
                :select-list="typeList"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <div class="sap"></div>
            <div
              class="consult-input-section-body-item-name"
              @click="selectSection = 'plan'"
            >
              <drop-box-component
                :select-list="studentList"
                :placeholder="planNameHolder"
                row-width="160px"
                row-height="40px"
                @selectValue="selectStudent"
              ></drop-box-component>
            </div>
            <i
              class="fa-solid fa-rotate-left"
              @click="removeFilter('plan')"
            ></i>
          </div>
          <div class="underline"></div>
          <div v-if="planConsultList" class="consult-plan-section-body-list">
            <div
              v-for="item in showPlanConsultList"
              class="consult-plan-section-body-list-item"
            >
              <div class="consult-plan-section-body-list-item-date">
                {{ item.consultDate?.substring(0, 4) }}년
                {{ item.consultDate?.substring(5, 7) }}월
                {{ item.consultDate?.substring(8, 10) }}일
                <div class="plan-sap"></div>
              </div>
              <div class="consult-plan-section-body-list-item-time">
                {{ item.consultDate?.substring(11, 16) }}
                <div class="plan-sap"></div>
              </div>
              <div class="consult-plan-section-body-list-item-type">
                {{ item.consultType }}
                <div class="plan-sap"></div>
              </div>
              <div class="consult-plan-section-body-list-item-student">
                {{ item.studentName }}
              </div>
              <div
                class="consult-plan-section-body-list-item-detail"
                @click="openInsertPopup(item)"
                가
                v-if="viewInput"
              >
                상담 결과 입력
              </div>
            </div>
          </div>
          <div v-if="planConsultList.length < 1" class="no-content">
            불러올 데이터가 없습니다.
          </div>
          <div class="consult-plan-section-body-pagination">
            <pagination-component
              @changePage="changePage"
              @selectPage="selectPage"
              :total-page="planPage"
              :current-page="planCurrentPage"
            ></pagination-component>
          </div>
        </div>
      </div>

      <div
        class="consult-list-section"
        :style="{
          top: !viewInput ? '510px' : '',
        }"
      >
        <div class="consult-list-section-tag">상담 목록 조회</div>
        <div class="consult-list-section-body">
          <div class="consult-list-section-body-item">
            <div class="consult-list-section-body-item-date">
              <i class="fa-solid fa-filter"></i>
              {{ listDate ? listDate?.toDateString() : "상담 날짜" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('list', 'date')"
              ></i>
              <v-date-picker
                class="calendar-date"
                v-if="listDateCalendarState"
                mode="date"
                v-model="listDate"
                :minute-increment="5"
              />
            </div>
            <div class="sap"></div>
            <div
              class="consult-input-section-body-item-type"
              @click="selectSection = 'list'"
            >
              <drop-box-component
                :placeholder="listTypeHolder"
                row-width="160px"
                row-height="40px"
                :select-list="typeList"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <div class="sap"></div>
            <div
              class="consult-input-section-body-item-name"
              @click="selectSection = 'list'"
            >
              <drop-box-component
                :select-list="studentList"
                :placeholder="listNameHolder"
                row-width="160px"
                row-height="40px"
                @selectValue="selectStudent"
              ></drop-box-component>
            </div>
            <i
              class="fa-solid fa-rotate-left"
              @click="removeFilter('list')"
            ></i>
          </div>
          <div class="consult-list-section-body-content">
            <data-list-component
              v-if="listTotalCnt"
              :header="listHeader"
              :list-cnt="7"
              list-type="consult"
              :data-list="listConsultList"
              :total-cnt="listTotalCnt ? listTotalCnt : 0"
              @showConsultDetail="showConsultDetail"
            ></data-list-component>
          </div>
          <div v-if="listConsultList.length < 1" class="no-content">
            불러올 데이터가 없습니다.
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      :title="selectSection === 'list' ? '상담 결과 조회' : '상담 결과 입력'"
    >
      <template v-slot:body v-if="selectSection === 'list'">
        <span class="del-btn" @click="deleteConsult">상담 내용 삭제하기</span>
        <div class="consult-detail">
          <div class="consult-detail-section">
            <div class="consult-detail-section-header-list">
              <div class="date">
                {{ listConsultDetail?.consultDate.substring(0, 4) }}년
                {{ listConsultDetail?.consultDate.substring(5, 7) }}월
                {{ listConsultDetail?.consultDate.substring(8, 10) }}일
              </div>
              <div class="sap"></div>
              <div class="time">
                {{ listConsultDetail?.consultDate.substring(11, 16) }}
              </div>
              <div class="sap"></div>
              <div class="type">
                {{ listConsultDetail?.consultType }}
              </div>
              <div class="sap"></div>
              <div class="name">{{ listConsultDetail?.studentName }}</div>
            </div>
            <div class="consult-detail-section-body">
              {{ listConsultDetail?.content }}
            </div>
          </div>
        </div>
      </template>

      <template v-slot:body v-if="selectSection === 'plan'">
        <div class="consult-detail">
          <div class="consult-detail-section">
            <div class="consult-detail-section-header">
              <div class="consult-detail-section-header-item">
                <div class="date">
                  {{ planDetailHeader?.consultDate.substring(0, 4) }}년
                  {{ planDetailHeader?.consultDate.substring(5, 7) }}월
                  {{ planDetailHeader?.consultDate.substring(8, 10) }}일
                </div>
                <div class="sap"></div>
                <div class="time">
                  {{ planDetailHeader?.consultDate.substring(11, 16) }}
                </div>
                <div class="sap"></div>
                <div class="type">
                  {{ planDetailHeader?.consultType }}
                </div>
                <div class="sap"></div>
                <div class="name">{{ planDetailHeader?.studentName }}</div>
              </div>
              <input
                type="button"
                value="상담 결과 작성"
                class="save-btn"
                @click="doInput"
              />
            </div>
            <textarea
              v-model="planDetailContent"
              placeholder="상담 결과를 입력해주세요."
              class="consult-detail-section-body"
            ></textarea>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
