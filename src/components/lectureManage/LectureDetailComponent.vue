<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  roomInterface,
  scheduleInterface,
} from "../../lib/types";
import common from "../../lib/common";
import { CONSTANT, KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import PaginationComponent from "../fixed/PaginationComponent.vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";

export default defineComponent({
  name: "LectureDetailComponent",
  components: { DropBoxComponent, PaginationComponent },
  props: {
    roomKey: {
      type: String as PropType<string>,
      required: false,
    },
  },
  setup(props) {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherKey = ref<string>("");
    const lectureNameList = ref<Array<defaultInterface>>([]);
    const lectureName = ref<string>("");
    const targetList: Array<defaultInterface> = [
      { KEY: "elementary", VALUE: "초등" },
      { KEY: "middle", VALUE: "중등" },
      { KEY: "high", VALUE: "고등" },
      { KEY: "repeat", VALUE: "재수" },
      { KEY: "essay", VALUE: "논술면접" },
      { KEY: "entrance", VALUE: "입시지도" },
      { KEY: "overseas", VALUE: "해외" },
      { KEY: "characterization", VALUE: "특성화" },
    ];
    const target = ref<string>("");
    const roomList = ref<Array<defaultInterface>>([]);
    const roomKey = ref<string>("");
    const roomName = ref<string>("");
    const day: Array<string> = ["월", "화", "수", "목", "금", "토", "일"];
    const lectureList = ref<Array<scheduleInterface>>([]);
    const viewLectureList = ref<Array<scheduleInterface>>([]);
    const lectureDetail = ref<scheduleInterface | undefined>(undefined);
    const page = ref<number>(0);
    const currentPage = ref<number>(1);

    const getRoomList = async () => {
      let data = { search: "" };

      const result = await ApiClient(
        "/lectures/getRoomList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: roomInterface) => {
            roomList.value.push({ KEY: item.roomKey, VALUE: item.name });
          });
        }
      }
    };

    const setLectureList = async () => {
      let data = {
        userKey: teacherKey.value,
        search: "",
        roomKey: props.roomKey ? props.roomKey : roomKey.value,
        roomName: roomName.value,
        target: target.value,
        lectureName: lectureName.value,
      };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            if (item.progress === "등록") {
              item.start = Number(item.startTime?.substring(0, 2));
              item.minute = Number(item.startTime?.substring(3, 5));

              lectureList.value.push(item);
              lectureNameList.value.push({
                KEY: item.lectureKey,
                VALUE: item.lectureName,
              });
            }
          });
        }
      }

      if (lectureList.value.length > 12) {
        viewLectureList.value = lectureList.value.slice(0, 12);
        page.value = Math.ceil(lectureList.value.length / 12);
      } else {
        viewLectureList.value = lectureList.value;
        page.value = 0;
      }
    };

    const selectLectureName = (name: defaultInterface) => {
      lectureName.value = name.VALUE as string;
    };

    const selectTarget = (selectedTarget: defaultInterface) => {
      target.value = selectedTarget.VALUE as string;
    };

    const selectRoom = (room: defaultInterface) => {
      roomName.value = room.VALUE as string;
    };

    const doSearch = () => {
      lectureList.value = [];
      lectureNameList.value = [];
      setLectureList();
    };

    const selectLecture = (lecture: scheduleInterface) => {
      lectureDetail.value = lecture;
    };

    const selectPage = (page: number) => {
      currentPage.value = page;
    };

    const changePage = (page: number) => {
      if (page === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    const downloadPlanner = async (lecture: scheduleInterface | undefined) => {
      if (lecture) {
        if (lecture.planner) {
          if (window.confirm("계획서를 다운로드 하시겠습니까?")) {
            const plannerUrl = CONSTANT.BASE_URL + "/media/" + lecture.planner;
            const response = await fetch(plannerUrl);
            if (response.ok) {
              const blob = await response.blob();
              const filename = `${lecture.teacherName}_${lecture.lectureName}_강의 계획서`;
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
        viewLectureList.value = lectureList.value.slice(
          12 * currentPage.value - 12,
          12 * currentPage.value
        );
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.LU)) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
          teacherKey.value = common.getItem(KEYS.LU).teacherKey;
        }
      }

      await getRoomList();
      await setLectureList();
    });

    return {
      category,
      lectureNameList,
      targetList,
      roomList,
      day,
      viewLectureList,
      lectureDetail,
      page,
      currentPage,
      selectLectureName,
      selectTarget,
      selectRoom,
      doSearch,
      selectLecture,
      selectPage,
      changePage,
      downloadPlanner,
    };
  },
});
</script>

<template>
  <section class="lecture-detail">
    <div class="lecture-detail">
      <div class="lecture-detail-section">
        <div class="lecture-detail-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="lecture-detail-section-body">
          <div class="lecture-detail-section-body-label">
            확인 원하는 강의를 선택해 주세요.
          </div>
          <div class="lecture-detail-section-body-left">
            <div class="lecture-detail-section-body-left-header">
              <drop-box-component
                placeholder="강의명"
                :select-list="lectureNameList"
                row-width="216px"
                row-height="32px"
                @selectValue="selectLectureName"
              ></drop-box-component>
              <drop-box-component
                placeholder="대상"
                :select-list="targetList"
                row-width="130px"
                row-height="32px"
                @selectValue="selectTarget"
              ></drop-box-component>
              <drop-box-component
                placeholder="강의실"
                :select-list="roomList"
                row-width="160px"
                row-height="32px"
                @selectValue="selectRoom"
              ></drop-box-component>
              <div class="find-button" @click="doSearch">강의 찾기</div>
            </div>
            <div class="lecture-detail-section-body-left-list">
              <div
                class="lecture-detail-section-body-left-list-item"
                v-for="item in viewLectureList"
                @click="selectLecture(item)"
              >
                <span class="lecture-name">{{ item.lectureName }}</span>
                <span class="teacher-name">{{ item.teacherName }}</span>
                <span class="target">{{ item.target }}</span>
                <span class="room-name">강의실 : {{ item.roomName }}</span>
              </div>
              <div class="lecture-detail-section-body-left-list-page">
                <pagination-component
                  :total-page="page"
                  :current-page="currentPage"
                  @selectPage="selectPage"
                  @changePage="changePage"
                ></pagination-component>
              </div>
            </div>
          </div>
          <div class="lecture-detail-section-body-right">
            <div class="lecture-detail-section-body-right-main">
              <div
                class="lecture-detail-section-body-right-main-tip"
                v-if="!lectureDetail"
              >
                <span>강의 상세 열람을</span
                ><span>원하는 강의를 선택해 주세요.</span>
              </div>
              <div
                class="lecture-detail-section-body-right-main-detail"
                v-if="lectureDetail"
              >
                <span class="title-label">강의 상세 조회</span>
                <span class="title-item">{{ lectureDetail.lectureName }}</span>
                <div class="sap"></div>
                <span class="label">강사명</span>
                <span class="item">{{ lectureDetail.teacherName }}</span>
                <span class="label">대상 학년</span>
                <span class="item">{{ lectureDetail.target }}</span>
                <span class="label">강의 요일</span>
                <span class="item">{{ day[lectureDetail.day - 1] }}</span>
                <span class="label">강의 시간</span>
                <span class="item"
                  >{{ lectureDetail.start }}:{{
                    lectureDetail.minute === 0 ? "00" : lectureDetail.minute
                  }}</span
                >
                <span class="label">강의 교재</span>
                <span class="item">{{ lectureDetail.book }}</span>
                <span class="label">수강 인원</span>
                <span class="item">{{ lectureDetail.total }} 명</span>
                <div
                  class="planner-btn"
                  @click="downloadPlanner(lectureDetail)"
                >
                  강의계획서 다운로드
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
