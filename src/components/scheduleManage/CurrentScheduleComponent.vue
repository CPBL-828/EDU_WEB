<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import common from "../../lib/common";
import {
  defaultInterface,
  roomInterface,
  scheduleInterface,
} from "../../lib/types";
import TimetableComponent from "../custom/TimetableComponent.vue";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import SelectListComponent from "../custom/SelectListComponent.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "CurrentScheduleComponent.vue",
  components: {
    SelectListComponent,
    ModalPopupComponent,
    SelectButtonComponent,
    TimetableComponent,
  },
  props: {
    adminState: {
      types: Boolean as PropType<boolean>,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string>("");
    const selectRoomState = ref(false);
    const roomKey = ref<string>("");
    const scheduleList = ref<Array<scheduleInterface>>([]);
    const scheduleDetail = ref<scheduleInterface | undefined>(undefined);
    const timeList: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectedTime = ref("pm");

    const getLectureList = async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        userKey.value = common.getItem(KEYS.LU).teacherKey;
      } else if (common.getItem(KEYS.UK).userKey == USER_KEY.STU) {
        userKey.value = common.getItem(KEYS.LU).studentKey;
      }

      let data = {
        userKey: userKey.value,
        roomKey: roomKey.value,
        target: "",
        roomName: "",
        lectureName: "",
      };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result) {
        scheduleList.value = [];
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            item.start = Number(item.startTime?.substring(0, 2));
            item.minute = Number(item.startTime?.substring(3, 5));

            if (item.progress === "등록") {
              scheduleList.value.push(item as scheduleInterface);
            }
          });
        }
      } else {
        scheduleList.value = [];
      }
    };

    const selectRoom = async (room: roomInterface) => {
      roomKey.value = room.roomKey;
      await getLectureList();
      selectRoomState.value = true;
    };

    const goBack = () => {
      router.go(0);
    };

    const changeTime = (time: string) => {
      selectedTime.value = time;
    };

    const selectSchedule = (schedule: scheduleInterface) => {
      scheduleDetail.value = schedule;
    };

    const showScheduleProgress = () => {
      store.commit("setModalState", true);
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.PAR) {
        const child = await common.setChildren(
          common.getItem(KEYS.LU).parentKey
        );

        if (child) {
          userKey.value = child.studentKey;
        }
      }

      await getLectureList();
    });

    return {
      category,
      selectRoomState,
      scheduleList,
      scheduleDetail,
      timeList,
      selectedTime,
      selectRoom,
      goBack,
      changeTime,
      selectSchedule,
      showScheduleProgress,
    };
  },
});
</script>

<template>
  <section class="current-schedule">
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
        <div class="current-schedule-section-body">
          <div class="current-schedule-section-body-today">
            <i class="fa-regular fa-calendar"></i> TODAY :
            {{ new Date().toISOString().substring(0, 4) }}년
            {{ new Date().toISOString().substring(5, 7) }}월
            {{ new Date().toISOString().substring(8, 10) }}일
            {{ new Date().toString().substring(0, 4) }}
          </div>
          <span
            @click="goBack"
            class="back-btn"
            v-if="adminState && selectRoomState"
            >강의실 다시 선택하기</span
          >
          <div
            class="current-schedule-section-body-button"
            v-if="!adminState || selectRoomState"
          >
            <div class="current-schedule-section-body-button-state">
              <select-button-component
                :select-list="timeList"
                :select-value="selectedTime"
                @changeTime="changeTime"
              ></select-button-component>
            </div>
            <div class="current-schedule-section-body-button-past">
              이전 시간표 조회
            </div>
          </div>
          <div class="current-schedule-section-body-lecture" v-if="adminState">
            <select-list-component
              v-if="!selectRoomState"
              list-type="ROOM"
              @selectRoom="selectRoom"
            ></select-list-component>
          </div>
          <div
            class="current-schedule-section-body-timetable"
            v-if="!adminState || selectRoomState"
          >
            <timetable-component
              :lecture-list="scheduleList"
              :select-type="selectedTime"
              @showLectureDetail="selectSchedule"
            ></timetable-component>
          </div>

          <div
            class="current-schedule-section-body-info"
            v-if="!adminState || selectRoomState"
          >
            <div class="current-schedule-section-body-info-container">
              <div class="info" v-if="!scheduleDetail">
                <div class="info-no-data">강의를 선택해 주세요</div>
                <div class="info-underline" v-if="scheduleDetail"></div>
              </div>
              <div class="info" v-if="scheduleDetail">
                <div class="info-name">{{ scheduleDetail.lectureName }}</div>
                <div class="info-underline"></div>
                <div class="info-teacher">
                  <div class="label">강사명</div>
                  {{ scheduleDetail.teacherName }}
                </div>
                <div class="info-book">
                  <div class="label">교재</div>
                  {{ scheduleDetail.book }}
                </div>
                <div class="info-grade">
                  <div class="label">학년</div>
                  {{ scheduleDetail.target }}
                </div>
                <div class="info-room">
                  <div class="label">강의실</div>
                  {{ scheduleDetail.roomName }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-popup-component title="강의 진행표"> </modal-popup-component>
  </section>
</template>
