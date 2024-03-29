<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import common from "../../lib/common";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import { ApiClient, FileClient } from "../../axios";
import { CONSTANT, KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import PaginationComponent from "../fixed/PaginationComponent.vue";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import TimetableComponent from "../custom/TimetableComponent.vue";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "PlanMakeComponent",
  components: {
    SelectButtonComponent,
    TimetableComponent,
    ModalPopupComponent,
    PaginationComponent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string>("");
    const adminState = ref(false);
    const dayList: Array<string> = [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];
    const planHeader: defaultInterface[] = [
      { KEY: "name", VALUE: "강의명" },
      { KEY: "dayList", VALUE: "요일" },
      { KEY: "time", VALUE: "시작 시간" },
      { KEY: "progress", VALUE: "처리 상태" },
      { KEY: "planner", VALUE: "강의 계획서" },
    ];
    const timeList: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectTime = ref("pm");
    const previewSchedule = ref<scheduleInterface | undefined>(undefined);
    const previewRoom = ref<string>("");
    const previewScheduleList = ref<Array<scheduleInterface>>([]);
    const rejectMode = ref(false);
    const rejectReason = ref<string>("");
    const scheduleList = ref<Array<scheduleInterface>>([]);
    const viewScheduleList = ref<Array<scheduleInterface>>([]);
    const page = ref<number>(0);
    const currentPage = ref<number>(1);

    const setLectureList = async () => {
      let data = {
        userKey: userKey.value,
        search: "",
        roomKey: previewRoom.value,
        target: "",
        roomName: "",
        lectureName: "",
      };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      scheduleList.value = [];
      previewScheduleList.value = [];

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            if (item.progress !== "등록") {
              scheduleList.value.push(item as scheduleInterface);
              item.start = Number(item.startTime?.substring(0, 2));
              item.minute = Number(item.startTime?.substring(3, 5));
            } else if (item.progress === "등록") {
              previewScheduleList.value.push(item as scheduleInterface);
              item.start = Number(item.startTime?.substring(0, 2));
              item.minute = Number(item.startTime?.substring(3, 5));
            }
          });
        }

        if (scheduleList.value.length > 11) {
          viewScheduleList.value = scheduleList.value.slice(0, 11);
          page.value = Math.ceil(scheduleList.value.length / 11);
        } else {
          viewScheduleList.value = scheduleList.value;
          page.value = 0;
        }
      }
    };

    const selectPage = (page: number) => {
      currentPage.value = page;
    };

    const changePage = (page: number) => {
      if (page === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    const viewProgress = (schedule: scheduleInterface) => {
      previewSchedule.value = schedule;
      store.commit("setModalState", true);
    };

    const showScheduleDetail = async (schedule: scheduleInterface) => {
      previewSchedule.value = schedule;
      previewRoom.value = schedule.roomKey_id;
      await setLectureList();
      previewScheduleList.value.push(schedule);
      store.commit("setModalState", true);
    };

    const changeTime = (time: string) => {
      selectTime.value = time;
    };

    const createLecture = async () => {
      let data = {
        lectureKey: previewSchedule.value?.lectureKey,
        adminKey: common.getItem(KEYS.LU).adminKey,
        progress: rejectReason.value ? "반려" : "등록",
        reason: rejectReason.value,
      };

      const result = await ApiClient(
        "/lectures/createLecture/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          if (rejectMode.value) {
            window.alert(
              previewSchedule.value?.lectureName +
                " 강의 편성 건의를 반려하였습니다."
            );
          } else {
            window.alert(
              previewSchedule.value?.lectureName +
                " 강의 편성을 승인하였습니다.\n이제 강의실 시간표를 통해 해당 강의를 확인하실 수 있습니다."
            );
          }
          router.go(0);
        }
      }
    };

    const doReject = async () => {
      if (!rejectMode.value) {
        rejectMode.value = true;
      } else {
        if (!rejectReason.value) {
          window.alert("반려 사유를 입력해 주세요.");
          return false;
        }

        await createLecture();
      }
    };

    const editLecturePlanner = async (schedule: scheduleInterface) => {
      const plannerData = ref<FormData>(new FormData());
      const plannerFile: HTMLInputElement = document.getElementById(
        schedule.lectureKey + "-input-file"
      ) as HTMLInputElement;

      if (plannerFile.files) {
        plannerData.value.append("lectureKey", schedule.lectureKey);
        plannerData.value.append("planner", plannerFile.files[0]);
      }

      const result = await FileClient(
        "/lectures/editLecturePlanner/",
        plannerData.value
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.EDIT) {
          window.alert(
            schedule.lectureName +
              " 강의의 강의 계획서를 성공적으로 업로드 하였습니다."
          );
          router.go(0);
        }
      } else {
        window.alert("강의 계획서 업로드에 실패하였습니다.");
      }
    };

    const downloadPlanner = async (schedule: scheduleInterface | undefined) => {
      if (schedule) {
        if (schedule.planner) {
          if (window.confirm("계획서를 다운로드 하시겠습니까?")) {
            const plannerUrl = CONSTANT.BASE_URL + "/media/" + schedule.planner;
            const response = await fetch(plannerUrl);
            if (response.ok) {
              const blob = await response.blob();
              const filename = `${schedule.teacherName}_${schedule.lectureName}_강의 계획서`;
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.setAttribute("download", filename);
              link.click();
              URL.revokeObjectURL(link.href);
            }
          } else {
            return false;
          }
        } else {
          window.alert("저장되어 있는 계획서가 없습니다.");
          return false;
        }
      }
    };

    watch(
      () => currentPage.value,
      () => {
        viewScheduleList.value = scheduleList.value.slice(
          11 * currentPage.value - 11,
          11 * currentPage.value
        );
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.LU)) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
          userKey.value = common.getItem(KEYS.LU).teacherKey;
        } else if (
          common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM ||
          common.getItem(KEYS.UK).userKey === USER_KEY.ETC_ADM
        ) {
          adminState.value = true;
        }
      }

      await setLectureList();
    });

    return {
      category,
      adminState,
      dayList,
      planHeader,
      timeList,
      selectTime,
      previewSchedule,
      previewScheduleList,
      rejectMode,
      rejectReason,
      viewScheduleList,
      page,
      currentPage,
      selectPage,
      changePage,
      viewProgress,
      showScheduleDetail,
      changeTime,
      createLecture,
      doReject,
      editLecturePlanner,
      downloadPlanner,
    };
  },
});
</script>

<template>
  <section class="planner">
    <div class="planner">
      <div class="planner-section">
        <div class="planner-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="planner-section-body">
          <span class="planner-section-body-tip"
            >반려 사유를 확인하려면 강의명을 클릭해 주세요.</span
          >
          <div class="planner-section-body-list">
            <table>
              <thead>
                <tr>
                  <th v-if="adminState" class="teacher">강사명</th>
                  <th class="name">{{ planHeader[0].VALUE }}</th>
                  <th class="dayList">{{ planHeader[1].VALUE }}</th>
                  <th class="time">{{ planHeader[2].VALUE }}</th>
                  <th class="progress">{{ planHeader[3].VALUE }}</th>
                  <th class="planner">
                    {{ !adminState ? planHeader[4].VALUE : "상세 보기" }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in viewScheduleList">
                  <td
                    class="teacher"
                    v-if="adminState"
                    :style="{ width: '15%' }"
                  >
                    {{ item.teacherName }}
                  </td>
                  <td
                    class="name"
                    :style="{ width: adminState ? '25%' : '30%' }"
                    @click="viewProgress(item)"
                  >
                    {{ item.lectureName }}
                  </td>
                  <td class="dayList">{{ dayList[item.day - 1] }}</td>
                  <td class="time">
                    {{ item.start }}:{{
                      item.minute === 0 ? item.minute + "0" : item.minute
                    }}
                  </td>
                  <td
                    class="progress"
                    :style="{
                      color: item.progress === '반려' ? 'red' : '$sub-color',
                    }"
                  >
                    {{ item.progress }}
                  </td>
                  <td class="planner">
                    <div v-if="!adminState">
                      <label
                        :for="item.lectureKey + '-input-file'"
                        class="btn-input"
                        >첨부하기</label
                      >
                      <form>
                        <input
                          @change="editLecturePlanner(item)"
                          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          type="file"
                          :id="item.lectureKey + '-input-file'"
                          :style="{ display: 'none' }"
                        />
                      </form>
                    </div>
                    <div v-else>
                      <input
                        type="button"
                        value="상세 보기"
                        class="btn-input"
                        @click="showScheduleDetail(item)"
                      />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="planner-section-body-page">
            <pagination-component
              :total-page="page"
              :current-page="currentPage"
              @selectPage="selectPage"
              @changePage="changePage"
            ></pagination-component>
          </div>
        </div>
      </div>
    </div>
    <modal-popup-component
      :title="adminState ? '강의 미리보기' : '반려 사유'"
      :modal-height="adminState ? '950px' : '600px'"
      :modal-width="adminState ? '1300px' : '900px'"
    >
      <template v-slot:body v-if="adminState">
        <div class="preview">
          <div class="preview-section">
            <div class="preview-section-schedule">
              <div class="preview-section-schedule-btn">
                <div class="preview-section-schedule-btn-select">
                  <select-button-component
                    :select-list="timeList"
                    :select-value="selectTime"
                    @changeTime="changeTime"
                  ></select-button-component>
                </div>
                <div
                  class="preview-section-schedule-btn-adm"
                  v-if="previewSchedule?.progress === '등록 대기 중'"
                >
                  <input
                    type="button"
                    value="등록"
                    class="preview-section-schedule-btn-adm-insert"
                    @click="createLecture"
                  />
                  <input
                    type="button"
                    value="반려"
                    class="preview-section-schedule-btn-adm-reject"
                    @click="doReject"
                  />
                </div>
              </div>
              <div class="preview-section-schedule-timetable">
                <timetable-component
                  :lecture-list="previewScheduleList"
                  :select-type="selectTime"
                ></timetable-component>
              </div>
            </div>
            <div class="preview-section-detail">
              <textarea
                v-if="rejectMode"
                class="preview-section-detail-reason"
                placeholder="반려 사유를 입력하고, 반려 버튼을 한 번 더 눌러주세요."
                v-model="rejectReason"
              ></textarea>
              <div
                v-if="previewSchedule?.reason"
                class="preview-section-detail-reject"
              >
                <span>반려</span>
                <div class="preview-section-detail-reject-reason">
                  {{ previewSchedule?.reason }}
                </div>
              </div>
              <div class="preview-section-detail-info" v-if="previewSchedule">
                <div class="preview-section-detail-info-container">
                  <div class="preview-section-detail-info-container-name">
                    <div class="label">미리 볼 강의명</div>
                    {{ previewSchedule.lectureName }}
                  </div>
                  <div
                    class="preview-section-detail-info-container-underline"
                  ></div>
                  <div class="preview-section-detail-info-container-teacher">
                    <div class="label">강사명</div>
                    {{ previewSchedule.teacherName }}
                  </div>
                  <div class="preview-section-detail-info-container-book">
                    <div class="label">교재</div>
                    {{ previewSchedule.book }}
                  </div>
                  <div class="preview-section-detail-info-container-grade">
                    <div class="label">학년</div>
                    {{ previewSchedule.target }}
                  </div>
                  <div class="preview-section-detail-info-container-room">
                    <div class="label">강의실</div>
                    {{ previewSchedule.roomName }}
                  </div>
                  <form>
                    <input
                      id="planner-download"
                      type="button"
                      value="강의 계획서 다운로드"
                      @click="downloadPlanner(previewSchedule)"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <template v-else v-slot:body>
        <div class="reason" v-if="previewSchedule">
          <div class="reason-detail">
            현재
            <span>{{ previewSchedule.lectureName }}</span>
            강의는
            <span
              :style="{
                color: previewSchedule.progress === '반려' ? 'red' : '#cccccc',
              }"
              >{{ previewSchedule.progress }}</span
            >
            상태입니다.
          </div>
          <div class="sap"></div>
          <div class="reason-reject" v-if="previewSchedule.progress === '반려'">
            <span class="reason-reject-tip">반려 사유는 다음과 같습니다.</span
            ><span class="reason-reject-detail">{{
              previewSchedule.reason
            }}</span>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
