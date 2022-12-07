<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
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
/*
@brief [강사, 관리자] [Main]학생 관리, [학부모] [Main]상담 및 분석
       [Sub]상담 접근 시, 강사는 본인이 담당하는 학생과의 상담 정보를, 관리자는 선택한 강사의 담당 학생 상담 정보를,
       학부모는 자신의 상담 정보를 표시
 */
export default defineComponent({
  name: "ConsultComponent",
  components: {
    ModalPopupComponent,
    DataListComponent,
    PaginationComponent,
    DropBoxComponent,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const selectSection = ref<string | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const adminInfo = ref<adminInterface | undefined>(undefined);
    const student = ref<defaultInterface>({ KEY: "", VALUE: "" });
    //TODO 일정 입력, 상담 예정 나누기
    const consultType = ref<string>("");
    const studentList = ref<Array<defaultInterface>>([]);

    const date = ref<string | undefined>(undefined);
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
    const inputName = ref<string | undefined>(undefined);
    const inputDateCalendarState = ref(false);
    const inputTimeCalendarState = ref(false);

    //상담 예정 현황
    const planDate = ref<Date | undefined>(undefined);
    const planName = ref<string | undefined>(undefined);
    const planDateCalendarState = ref(false);
    const planConsultList = ref<Array<consultInterface>>([]);
    const showPlanConsultList = ref<Array<consultInterface>>([]);
    const planTotalCnt = ref<number>(0);
    const planPage = ref<number>(0);
    const planCurrentPage = ref<number>(1);
    const planListCnt: number = 4;
    const planDetailHeader = ref<consultInterface | undefined>(undefined);
    const planDetailContent = ref<string>("");

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

    const setStudentList = async () => {
      let data = {
        userKey: teacherInfo.value?.teacherKey,
        search: "",
        lectureKey: "",
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
        userKey: teacherInfo.value?.teacherKey,
        studentKey: student.value.KEY,
        search: consultType.value,
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

    const selectInputType = (item: defaultInterface) => {
      inputType.value = (item.VALUE as string) + " 상담";
    };

    const selectType = (item: defaultInterface) => {
      consultType.value = item.VALUE as string;
      setConsultList();
    };

    const selectStudent = (item: defaultInterface) => {
      student.value.KEY = item.KEY;
      student.value.VALUE = item.VALUE;

      if (selectSection.value === "plan" || selectSection.value === "list") {
        setConsultList();
      }
    };

    const selectPage = (n: number) => {
      planCurrentPage.value = n;
    };

    const changePage = (n: number) => {
      if (n === 1) planCurrentPage.value = planCurrentPage.value + 1;
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
        targetKey: teacherInfo.value?.teacherKey,
        targetName: teacherInfo.value?.name,
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

    const openInsertPopup = (item: consultInterface) => {
      selectSection.value = "plan";
      planDetailHeader.value = item;
      store.commit("setModalState", true);
    };

    const doInput = async () => {
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

    const showConsultDetail = (item: consultInterface) => {
      selectSection.value = "list";
      listConsultDetail.value = item;
      store.commit("setModalState", true);
      document.getElementById("consult")?.scrollTo(0, 0);
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

    onMounted(async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherInfo.value = common.getItem(KEYS.LU) as teacherInterface;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.ADM) {
        adminInfo.value = common.getItem(KEYS.LU) as adminInterface;
      }

      await setStudentList();
      await setConsultList();
    });

    return {
      selectSection,
      studentList,
      date,
      time,
      typeList,
      inputDate,
      inputTime,
      inputName,
      inputDateCalendarState,
      inputTimeCalendarState,
      planDate,
      planName,
      planDateCalendarState,
      planConsultList,
      showPlanConsultList,
      planTotalCnt,
      planPage,
      planCurrentPage,
      planDetailHeader,
      planDetailContent,
      listDate,
      listDateCalendarState,
      listConsultList,
      listTotalCnt,
      listHeader,
      listConsultDetail,
      openCalendar,
      selectInputType,
      selectType,
      selectStudent,
      selectPage,
      changePage,
      insertConsult,
      openInsertPopup,
      doInput,
      showConsultDetail,
    };
  },
});
</script>

<template>
  <section class="consult" id="consult">
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
            <div class="sap"></div>
            <div
              class="consult-input-section-body-item-type"
              @click="selectSection = 'plan'"
            >
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
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
            <div class="sap"></div>
            <div
              class="consult-input-section-body-item-type"
              @click="selectSection = 'list'"
            >
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
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
      <template v-slot:button v-if="selectSection === 'plan'">
        <div class="btn">
          <div class="btn-insert" @click="doInput">저장하기</div>
        </div>
      </template>
      <template v-slot:body v-if="selectSection === 'list'">
        <div class="consult-detail">
          <div class="consult-detail-section">
            <div class="consult-detail-section-header">
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
