<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  roomInterface,
  scheduleInterface,
  teacherInterface,
} from "../../lib/types";
/*
@brief 강의별로 열람해야 하는 데이터를 위해 초기 강의 선택 단계 화면
 */
export default defineComponent({
  name: "SelectLectureComponent",
  components: { SelectButtonComponent },
  props: {
    listType: {
      types: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const lectureList = ref<Array<scheduleInterface>>([]);
    const showLectureList = ref<Array<scheduleInterface>>([]);
    const color = ref<Array<string>>([
      "#d57a7b",
      "#e39177",
      "#eeb958",
      "#80bdca",
      "#678cbf",
      "#a4a6d2",
      "#cc6699",
      "#e55c65",
      "#e58a4e",
      "#74c29a",
      "#5db7ad",
      "#98b6cd",
    ]);
    const lecturePage = ref<number>(0);
    const currentLecturePage = ref<number>(1);
    const selectItem: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectState = ref("pm");

    const roomList = ref<Array<roomInterface>>([]);
    const showRoomList = ref<Array<roomInterface>>([]);
    const roomPage = ref<number>(0);
    const currentRoomPage = ref<number>(1);

    const setLectureList = async () => {
      lectureList.value = [];
      showLectureList.value = [];
      let data = {
        userKey: teacherInfo.value?.teacherKey
          ? teacherInfo.value?.teacherKey
          : "",
        search: "",
        roomKey: "",
        roomName: "",
        lectureName: "",
        target: "",
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

              if (selectState.value === "pm") {
                if (item.start >= 13) lectureList.value.push(item);
              } else {
                if (item.start < 13) lectureList.value.push(item);
              }
            }
          });
        }
      }

      if (lectureList.value.length > 10) {
        showLectureList.value = lectureList.value.slice(0, 10);
        lecturePage.value = Math.ceil(lectureList.value.length / 10);
      } else {
        showLectureList.value = lectureList.value;
        lecturePage.value = 0;
      }
    };

    const setRoomList = async () => {
      let data = { search: "" };

      const result = await ApiClient(
        "/lectures/getRoomList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          roomList.value = result.resultData as roomInterface[];
        }
      }

      if (roomList.value.length > 10) {
        showRoomList.value = roomList.value.slice(0, 10);
        roomPage.value = Math.ceil(roomList.value.length / 10);
      } else {
        showRoomList.value = roomList.value;
        roomPage.value = 0;
      }
    };

    const changeState = (v: string) => {
      selectState.value = v;
    };

    const selectPage = (n: number) => {
      currentLecturePage.value = n;
    };

    const changePage = (n: number) => {
      if (n === 1) currentLecturePage.value = currentLecturePage.value + 1;
      else currentLecturePage.value = currentLecturePage.value - 1;
    };

    watch(
      () => currentLecturePage.value,
      () => {
        showLectureList.value = lectureList.value.slice(
          10 * currentLecturePage.value - 10,
          10 * currentLecturePage.value
        );
      }
    );

    watch(
      () => selectState.value,
      () => {
        setLectureList();
      }
    );

    onMounted(async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherInfo.value = common.getItem(KEYS.LU) as teacherInterface;
      }

      if (props.listType === "LECTURE") await setLectureList();
      else if (props.listType === "ROOM") await setRoomList();

      color.value = color.value.sort(() => Math.random() - 0.5);
    });

    return {
      teacherInfo,
      showLectureList,
      color,
      lecturePage,
      currentLecturePage,
      selectItem,
      selectState,
      roomList,
      showRoomList,
      roomPage,
      currentRoomPage,
      changeState,
      selectPage,
      changePage,
    };
  },
});
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import SelectButtonComponent from "./SelectButtonComponent.vue";
</script>

<template>
  <section class="select-lecture">
    <div class="select-lecture" v-if="listType === 'LECTURE'">
      <div class="select-lecture-label">
        <span class="select-lecture-label-teacher">
          {{ teacherInfo?.name }} 강사님의 강의 현황
        </span>
        <span class="select-lecture-label-tip"
          >열람할 강의를 선택해주세요.</span
        >
        <div class="select-lecture-label-button">
          <select-button-component
            :state-value="selectItem"
            :select-value="selectState"
            @changeState="changeState"
          ></select-button-component>
        </div>
      </div>
      <div class="sap"></div>
      <div class="select-lecture-list">
        <div
          class="select-lecture-list-item"
          v-for="(item, index) in showLectureList"
          :style="{ backgroundColor: color[index] }"
          @click="$emit('selectLecture', item)"
        >
          <span class="select-lecture-list-item-name">{{
            item.lectureName
          }}</span>
          <span class="select-lecture-list-item-target">{{ item.target }}</span>
          <span class="select-lecture-list-item-view"
            >열람하기 <i class="fa-solid fa-angles-right"></i
          ></span>
        </div>
      </div>
    </div>

    <div class="select-lecture" v-else-if="listType === 'ROOM'">
      <div class="select-lecture-label">
        <span class="select-lecture-label-teacher"> 강의실 현황 </span>
        <span class="select-lecture-label-tip"
          >열람할 강의실을 선택해주세요.</span
        >
      </div>
      <div class="sap"></div>
      <div class="select-lecture-list">
        <div
          class="select-lecture-list-item"
          v-for="(item, index) in showRoomList"
          @click="$emit('selectLecture', item)"
        >
          <span class="select-lecture-list-item-name">{{ item.name }}</span>
          <span class="select-lecture-list-item-target">{{ item.type }}</span>
          <span class="select-lecture-list-item-view"
            >열람하기 <i class="fa-solid fa-angles-right"></i
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>
