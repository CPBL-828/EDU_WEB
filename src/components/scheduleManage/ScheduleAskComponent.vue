<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import common from "../../lib/common";
import {
  defaultInterface,
  groupInterface,
  roomInterface,
  scheduleInterface,
} from "../../lib/types";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import { KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import TimetableComponent from "../custom/TimetableComponent.vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ScheduleAskComponent",
  components: {
    ModalPopupComponent,
    DropBoxComponent,
    SelectButtonComponent,
    TimetableComponent,
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string | undefined>(undefined);
    const roomKey = ref<string | undefined>(undefined);
    const roomName = ref<string>("");
    const scheduleName = ref<string>("");
    const selectDay = ref<string>("");
    const time = ref<Date>(new Date());
    const duration = ref<number>();
    const groupKey = ref<string>("");
    const book = ref<string>("");
    const groupList = ref<Array<groupInterface> | undefined>(undefined);
    const selectGroupList = ref<Array<defaultInterface>>([]);
    const roomList = ref<Array<roomInterface> | undefined>(undefined);
    const selectRoomList = ref<Array<defaultInterface>>([]);
    const days: Array<string> = ["월", "화", "수", "목", "금", "토", "일"];
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
    const timeList: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectTime = ref("pm");

    const changeTime = (time: string) => {
      selectTime.value = time;
    };

    const getLectureList = async () => {
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

    const getGroupList = async () => {
      let data = {
        userType: common.getItem(KEYS.UK).userKey,
        teacherKey: common.getItem(KEYS.LU).teacherKey,
        studentKey: "",
      };

      const result = await ApiClient(
        "/lectures/getGroupList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          groupList.value = result.resultData as groupInterface[];

          groupList.value.map((item: groupInterface) => {
            selectGroupList.value.push({
              KEY: item.groupKey,
              VALUE: item.groupName,
            });
          });
        }
      }
    };

    const selectGroup = (group: defaultInterface) => {
      groupKey.value = group.KEY;
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
      roomName.value = room.VALUE as string;
      await getLectureList();
    };

    const changeDay = (day: defaultInterface) => {
      selectDay.value = day.VALUE as string;
    };

    const showScheduleBook = () => {
      store.commit("setModalState", true);
    };

    const insertBook = () => {
      if (!book.value) {
        if (
          window.confirm("입력된 교재명이 없습니다.\n입력을 취소하시겠어요?")
        ) {
          store.commit("setModalState", false);
        } else {
          return false;
        }
      } else {
        window.alert("성공적으로 입력했습니다.");
        store.commit("setModalState", false);
      }
    };

    const createLecturePlan = async () => {
      if (!groupKey.value) {
        window.alert("반을 선택해 주세요.");
      } else if (!roomKey.value) {
        window.alert("강의실을 선택해 주세요.");
        return false;
      } else if (!scheduleName.value) {
        window.alert("강의명을 입력해 주세요.");
        return false;
      } else if (!selectDay.value) {
        window.alert("요일을 선택해 주세요.");
        return false;
      } else if (!duration.value) {
        window.alert("수업 진행 시간을 입력해 주세요.");
        return false;
      } else if (!book.value) {
        window.alert("교재명을 입력해 주세요.");
        return false;
      }

      if (
        window.confirm(
          "한 번 등록된 건의사항은 수정 및 삭제가 불가합니다.\n시간표 건의를 최종 등록하시겠습니까?"
        )
      ) {
        let data = {
          roomKey: roomKey.value,
          teacherKey: userKey.value,
          lectureName: scheduleName.value,
          roomName: roomName.value,
          teacherName: common.getItem(KEYS.LU).name,
          type: "1인", //TODO 강의유형 selectBox 만들어야 함
          subject: common.getItem(KEYS.LU).resSubject,
          book: book.value,
          target: common.getItem(KEYS.LU).part,
          day: days.indexOf(selectDay.value) + 1,
          startTime: time.value
            .toLocaleTimeString()
            .replace(":", "-")
            .split(":")[0],
          duration: duration.value,
          groupKey: groupKey.value,
        };

        const result = await ApiClient(
          "/lectures/createLecturePlan/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.CREATE) {
            if (
              window.confirm(
                scheduleName.value +
                  " 강의가 성공적으로 건의 목록에 등록되었습니다.\n계획서를 작성하시겠습니까?"
              )
            ) {
              common.removeItem(KEYS.SR);
              common.setItem(KEYS.SR, common.makeJson({ sr: "plan" }));
              await router.push("/schedule/plan");
            } else {
              return false;
            }
          }
        } else {
          window.alert("시간표 건의에 실패했습니다.");
          return false;
        }
      } else {
        return false;
      }
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        userKey.value = common.getItem(KEYS.LU).teacherKey;
      }

      await getGroupList();
      await getRoomList();
    });

    return {
      category,
      scheduleName,
      selectDay,
      time,
      duration,
      book,
      selectGroupList,
      roomList,
      selectRoomList,
      selectDayList,
      scheduleList,
      timeList,
      selectTime,
      changeTime,
      selectGroup,
      selectRoom,
      changeDay,
      showScheduleBook,
      insertBook,
      createLecturePlan,
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
                :select-list="timeList"
                :select-value="selectTime"
                @changeTime="changeTime"
              ></select-button-component>
            </div>
          </div>
          <div class="schedule-ask-section-body-timetable">
            <timetable-component
              :lecture-list="scheduleList"
              :select-type="selectTime"
            ></timetable-component>
          </div>
          <div class="schedule-ask-section-body-info">
            <div class="schedule-ask-section-body-info-container">
              <span>건의 내용 선택</span>
              <div class="schedule-ask-section-body-info-container-item">
                <drop-box-component
                  :select-list="selectGroupList"
                  placeholder="대상 반"
                  row-width="216px"
                  row-height="30px"
                  @selectValue="selectGroup"
                ></drop-box-component>
                <drop-box-component
                  :select-list="selectRoomList"
                  placeholder="강의실 목록"
                  row-width="216px"
                  row-height="30px"
                  @selectValue="selectRoom"
                ></drop-box-component>
                <input
                  class="name"
                  type="text"
                  placeholder="강의명"
                  v-model="scheduleName"
                />
                <drop-box-component
                  :select-list="selectDayList"
                  placeholder="요일"
                  row-width="216px"
                  row-height="30px"
                  @selectValue="changeDay"
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
                  @click="showScheduleBook"
                >
                  교재 링크 입력하기
                </button>
              </div>
              <input
                type="button"
                value="건의하기"
                class="schedule-ask-section-body-info-container-submit"
                @click="createLecturePlan"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      title="교재 입력하기"
      modal-height="200px"
      modal-width="700px"
    >
      <template v-slot:button>
        <div class="btn">
          <div class="btn-save-active" @click="insertBook">저장하기</div>
        </div>
      </template>
      <template v-slot:body>
        <div class="insert-book">
          <span class="tip">교재명을 입력해 주세요.</span>
          <input type="text" class="insert-book-input" v-model="book" />
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
