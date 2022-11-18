<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import { consultInterface, defaultInterface } from "../../lib/types";
import { ApiClient } from "../../axios";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import PaginationComponent from "../fixed/PaginationComponent.vue";
import DataListComponent from "../custom/DataListComponent.vue";
/*
@brief 강사는 메인 카테고리 [학생 관리]의 [상담]으로 접근 가능
       관리자는 메인 카테고리 [학생 관리], [강사 관리]의 [상담]으로 접근 가능
       TODO 현재 상담의 정책 부분에 대한 협의가 진행 중
 */
export default defineComponent({
  name: "ConsultComponent",
  components: { DataListComponent, PaginationComponent, DropBoxComponent },
  setup() {
    const selectSection = ref<string | undefined>(undefined);
    const userKey = ref<string | undefined>(undefined);
    const studentKey = ref<string>("");

    const date = ref<string | undefined>(undefined);
    const time = ref<string | undefined>(undefined);
    const inputDate = ref<Date | undefined>(undefined);
    const inputTime = ref<Date>(new Date());
    const inputName = ref<string | undefined>(undefined);
    const planDate = ref<Date | undefined>(undefined);
    const planName = ref<string | undefined>(undefined);
    const listDate = ref<Date | undefined>(undefined);
    const inputDateCalendarState = ref(false);
    const inputTimeCalendarState = ref(false);
    const planDateCalendarState = ref(false);
    const listDateCalendarState = ref(false);
    const typeList: defaultInterface[] = [
      { KEY: "STUDENT", VALUE: "학생" },
      { KEY: "PARENT", VALUE: "학부모" },
      { KEY: "ENTRANCE", VALUE: "입시" },
      { KEY: "SCORE", VALUE: "성적" },
      { KEY: "ETC", VALUE: "기타" },
    ];
    const planTotalCnt = ref<number>(0);
    const planPage = ref<number>(0);
    const planCurrentPage = ref<number>(1);
    const planListCnt: number = 4;

    const planConsultList = ref<Array<consultInterface>>([]);
    const showPlanConsultList = ref<Array<consultInterface>>([]);
    const listConsultList = ref<Array<consultInterface>>([]);
    const listTotalCnt = ref<number | undefined>(undefined);
    const showListConsultList = ref<Array<consultInterface>>([]);

    const listHeader: defaultInterface[] = [
      { KEY: "date", VALUE: "상담 일자" },
      { KEY: "time", VALUE: "상담 시간" },
      { KEY: "type", VALUE: "상담 유형" },
      { KEY: "student", VALUE: "상담 학생" },
      { KEY: "teacher", VALUE: "상담 강사" },
    ];

    const studentList = ref<Array<defaultInterface>>([]);
    const setStudentList = async () => {
      let data = { userKey: userKey.value, search: "" };
      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result.count > 0) {
        for (let i = 0; i < result.count; i++) {
          studentList.value[i] = {
            KEY: result.resultData[i].studentKey,
            VALUE: result.resultData[i].name,
          };
        }
      }
    };

    const setConsultList = async () => {
      let data = { userKey: userKey.value, studentKey: studentKey.value };
      const result = await ApiClient(
        "/info/getConsultList/",
        common.makeJson(data)
      );

      if (result.count > 0) {
        if (!selectSection.value) {
          result.resultData.map((item: consultInterface) => {
            if (item.content) {
              listConsultList.value.push(item);
            } else {
              planConsultList.value.push(item);
            }
          });
        } else if (selectSection.value === "plan") {
          planConsultList.value = [];
          result.resultData.map((item: consultInterface) => {
            planConsultList.value.push(item);
          });
        } else if (selectSection.value === "list") {
          listConsultList.value = [];
          result.resultData.map((item: consultInterface) => {
            listConsultList.value.push(item);
          });
        }
      } else {
        if (selectSection.value === "plan") planConsultList.value = [];
        else if (selectSection.value === "list") listConsultList.value = [];
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

    const selectPage = (n: number) => {
      planCurrentPage.value = n;
    };

    const changePage = (n: number) => {
      if (n === 1) planCurrentPage.value = planCurrentPage.value + 1;
      else planCurrentPage.value = planCurrentPage.value - 1;
    };

    const openCalendar = (m: string, n: string) => {
      if (m === "input") {
        if (n === "date") {
          inputDateCalendarState.value = !inputDateCalendarState.value;
        } else {
          inputTimeCalendarState.value = !inputTimeCalendarState.value;
        }
      } else if (m === "plan") {
        planDateCalendarState.value = !planDateCalendarState.value;
      } else {
        listDateCalendarState.value = !listDateCalendarState.value;
      }
    };

    const selectType = (item: defaultInterface) => {
      // console.log("상담 유형:", item);
    };

    const selectStudent = (item: defaultInterface) => {
      studentKey.value = item.KEY;
      setConsultList();
    };

    const insertConsult = () => {
      if (!date.value) {
        window.alert("상담 날짜를 입력해 주세요.");
      } else if (!time.value) {
        window.alert("상담 시간을 입력해 주세요.");
      } else if (!inputName.value) {
        window.alert("학생 이름을 입력해 주세요.");
      }
      let data = {
        date: date.value,
        time: time.value,
        name: inputName.value,
      };
    };

    watch(
      () => inputDate.value,
      () => {
        date.value = inputDate.value?.toDateString();
      }
    );

    watch(
      () => planDate.value,
      () => {
        date.value = planDate.value?.toDateString();
      }
    );

    watch(
      () => listDate.value,
      () => {
        date.value = listDate.value?.toDateString();
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

    onMounted(() => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        userKey.value = common.getItem(KEYS.LU).teacherKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.ADM) {
        userKey.value = common.getItem(KEYS.LU).adminKey;
      }

      setStudentList();
      setConsultList();
    });

    return {
      selectSection,
      date,
      time,
      inputDate,
      inputTime,
      inputName,
      planDate,
      planName,
      listDate,
      inputDateCalendarState,
      inputTimeCalendarState,
      planDateCalendarState,
      listDateCalendarState,
      typeList,
      planTotalCnt,
      planCurrentPage,
      planPage,
      selectType,
      selectStudent,
      planConsultList,
      showPlanConsultList,
      listConsultList,
      listTotalCnt,
      listHeader,
      studentList,
      openCalendar,
      insertConsult,
      selectPage,
      changePage,
    };
  },
});
</script>

<template>
  <section class="consult">
    <div class="consult">
      <div class="consult-input-section">
        <div class="consult-input-section-tag">상담 일정 입력</div>
        <div class="consult-input-section-body">
          <span class="consult-input-section-body-title">
            상담 정보를 추가해주세요.
          </span>
          <div class="consult-input-section-body-item">
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
            <span class="separ">|</span>
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
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-type">
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
                :select-list="typeList"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-name">
              <drop-box-component
                :select-list="studentList"
                placeholder="학생명"
                row-width="160px"
                @selectValue="selectStudent"
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

      <div class="consult-plan-section">
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
            <span class="sapar">|</span>
            <div class="consult-input-section-body-item-type">
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
                :select-list="typeList"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <span class="sapar">|</span>
            <div
              class="consult-input-section-body-item-name"
              @click="selectSection = 'plan'"
            >
              <drop-box-component
                :select-list="studentList"
                placeholder="학생명"
                row-width="160px"
                @selectValue="selectStudent"
              ></drop-box-component>
            </div>
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
                <div class="sap"></div>
              </div>
              <div class="consult-plan-section-body-list-item-time">
                {{ item.consultDate?.substring(11, 16) }}
                <div class="sap"></div>
              </div>
              <div class="consult-plan-section-body-list-item-type">
                {{ item.consultType }}
                <div class="sap"></div>
              </div>
              <div class="consult-plan-section-body-list-item-student">
                {{ item.studentKey_id }}
              </div>
              <div class="consult-plan-section-body-list-item-detail">
                상담 결과 입력
              </div>
            </div>
          </div>
          <div
            v-if="planConsultList.length < 1"
            class="consult-plan-section-body-list"
          >
            불러올 데이터가 없습니다.
          </div>
          <div class="consult-plan-section-body-pagination">
            <pagination-component
              v-if="planPage !== 0"
              @changePage="changePage"
              @selectPage="selectPage"
              :page="planPage"
              :current-page="planCurrentPage"
            ></pagination-component>
          </div>
        </div>
      </div>

      <div class="consult-list-section">
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
            <span class="sapar">|</span>
            <div class="consult-input-section-body-item-type">
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
                :select-list="typeList"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <span class="sapar">|</span>
            <div
              class="consult-input-section-body-item-name"
              @click="selectSection = 'list'"
            >
              <drop-box-component
                :select-list="studentList"
                placeholder="학생명"
                row-width="160px"
                @selectValue="selectStudent"
              ></drop-box-component>
            </div>
          </div>
          <div class="consult-list-section-body-content">
            <data-list-component
              v-if="listTotalCnt"
              :header="listHeader"
              :list-cnt="7"
              list-type="consult"
              :data-list="listConsultList"
              :total-cnt="listTotalCnt ? listTotalCnt : 0"
            ></data-list-component>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
