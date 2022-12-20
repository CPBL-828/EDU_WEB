<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import common from "../../lib/common";
import {
  defaultInterface,
  roomInterface,
  scheduleInterface,
} from "../../lib/types";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import TimetableComponent from "../custom/TimetableComponent.vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
/*
@brief [강사] [Main]시간표 관리 [Sub]시간표 건의
       강의실 선택 시, 해당 강의실을 시간표 표시
       강의실, 강의명, 요일, 시작 입력 받고 계획서, 교재 링크 추가해서 건의
 */
export default defineComponent({
  name: "ScheduleAskComponent",
  components: { DropBoxComponent, SelectButtonComponent, TimetableComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string | undefined>(undefined);
    const roomKey = ref<string | undefined>(undefined);
    const scheduleName = ref<string>("");
    const selectedDay = ref<string>("");
    const time = ref<Date>(new Date());
    const duration = ref<number>();
    const roomList = ref<Array<roomInterface> | undefined>(undefined);
    const selectRoomList = ref<Array<defaultInterface>>([]);
    const selectDayList = ref<Array<defaultInterface>>([
      { KEY: "mon", VALUE: "월" },
      { KEY: "tue", VALUE: "화" },
      { KEY: "wed", VALUE: "수" },
      { KEY: "thu", VALUE: "목" },
      { KEY: "fri", VALUE: "금" },
      { KEY: "sat", VALUE: "토" },
      { KEY: "sun", VALUE: "일" },
    ]);
    const scheduleList = ref<Array<scheduleInterface>>([]);
    const selectItem: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectState = ref("pm");

    const changeState = (v: string) => {
      selectState.value = v;
    };

    const getScheduleList = async () => {
      let data = {
        userKey: userKey.value,
        search: "",
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
      }
    };

    const getRoomList = async () => {
      let data = { search: "" };
      const result = await ApiClient(
        "/lectures/getRoomList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          roomList.value = result.resultData as roomInterface[];

          roomList.value.map((item: roomInterface) => {
            selectRoomList.value.push({ KEY: item.roomKey, VALUE: item.name });
          });
        }
      }
    };

    const selectRoom = async (room: defaultInterface) => {
      roomKey.value = room.KEY;
      await getScheduleList();
    };

    const selectDay = (d: defaultInterface) => {
      selectedDay.value = d.VALUE as string;
    };

    //TODO...
    const insertAsk = async () => {
      let data = {
        roomKey: roomKey.value,
        teacherKey: userKey.value,
        lectureName: "",
        roomName: "",
        teacherName: "",
        type: "",
        subject: "",
        book: "",
        target: "",
        day: "",
        startTime: "",
        duration: "",
        progress: "",
        reason: "",
      };
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        userKey.value = common.getItem(KEYS.LU).teacherKey;
      }

      await getRoomList();
    });

    return {
      category,
      scheduleName,
      selectedDay,
      time,
      duration,
      roomList,
      selectRoomList,
      selectDayList,
      scheduleList,
      selectItem,
      selectState,
      changeState,
      selectRoom,
      selectDay,
      insertAsk,
    };
  },
});
</script>

<template>
  <section class="schedule-ask">
    <div class="schedule-ask">
      <div class="schedule-ask-section">
        <div class="schedule-ask-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="schedule-ask-section-body">
          <div class="schedule-ask-section-body-today">
            <i class="fa-regular fa-calendar"></i> TODAY :
            {{ new Date().toISOString().substring(0, 4) }}년
            {{ new Date().toISOString().substring(5, 7) }}월
            {{ new Date().toISOString().substring(8, 10) }}일
            {{ new Date().toString().substring(0, 4) }}
          </div>
          <div class="schedule-ask-section-body-button">
            <div class="schedule-ask-section-body-button-state">
              <select-button-component
                :state-value="selectItem"
                :select-value="selectState"
                @changeState="changeState"
              ></select-button-component>
            </div>
          </div>
          <div class="schedule-ask-section-body-timetable">
            <timetable-component
              :schedule-list="scheduleList"
              :select-type="selectState"
            ></timetable-component>
          </div>
          <div class="schedule-ask-section-body-info">
            <div class="schedule-ask-section-body-info-container">
              <span>건의 내용 선택</span>
              <div class="schedule-ask-section-body-info-container-item">
                <drop-box-component
                  :select-list="selectRoomList"
                  placeholder="강의실 목록"
                  row-width="216px"
                  row-height="24px"
                  @selectValue="selectRoom"
                ></drop-box-component>
                <input
                  class="name"
                  type="text"
                  placeholder="강의명"
                  v-model="scheduleName"
                />
                <!--                <drop-box-component-->
                <!--                  :select-list="selectRoomList"-->
                <!--                  placeholder="대상 학년"-->
                <!--                  row-width="216px"-->
                <!--                  row-height="24px"-->
                <!--                  @selectValue="selectRoom"-->
                <!--                ></drop-box-component>-->
                <drop-box-component
                  :select-list="selectDayList"
                  placeholder="요일"
                  row-width="216px"
                  row-height="24px"
                  @selectValue="selectDay"
                ></drop-box-component>
                <div class="start">
                  <div class="start-label">시작 시간</div>
                  <v-date-picker
                    class="start-time"
                    v-model="time"
                    mode="time"
                    :minute-increment="10"
                    is24hr
                  ></v-date-picker>
                </div>
                <div class="duration">
                  <div class="duration-label">지속 시간</div>
                  <div class="duration-time">
                    <input
                      class="duration-time-minute"
                      type="text"
                      placeholder="00"
                      v-model="duration"
                    />
                    <span>분</span>
                  </div>
                </div>
              </div>
              <div class="schedule-ask-section-body-info-container-etc">
                <button
                  class="schedule-ask-section-body-info-container-etc-planner"
                >
                  강의 계획서 첨부하기
                </button>
                <button
                  class="schedule-ask-section-body-info-container-etc-book"
                >
                  교재 링크 입력하기
                </button>
              </div>
              <input
                type="button"
                value="건의하기"
                class="schedule-ask-section-body-info-container-submit"
                @click="insertAsk"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
