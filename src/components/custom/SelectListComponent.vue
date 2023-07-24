<script lang="ts">
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import SelectButtonComponent from "./SelectButtonComponent.vue";
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  roomInterface,
  scheduleInterface,
  teacherInterface,
} from "../../lib/types";

export default defineComponent({
  name: "SelectListComponent",
  components: { SelectButtonComponent },
  props: {
    listType: {
      types: String as PropType<string>,
      required: true,
    },
    isConsult: {
      type: String as PropType<string>,
      required: false,
    },
  },
  setup(props) {
    const userKey = ref<string>("");
    const teacherDetail = ref<teacherInterface | undefined>(undefined);
    const lectureList = ref<Array<scheduleInterface>>([]);
    const showLectureList = ref<Array<scheduleInterface>>([]);
    const lectureColor = ref<Array<string>>([
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
    const selectList: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectValue = ref("pm");

    const roomList = ref<Array<roomInterface>>([]);
    const showRoomList = ref<Array<roomInterface>>([]);
    const roomPage = ref<number>(0);
    const currentRoomPage = ref<number>(1);

    const teacherList = ref<Array<teacherInterface>>([]);
    const showTeacherList = ref<Array<teacherInterface>>([]);
    const teacherPage = ref<number>(0);
    const currentTeacherPage = ref<number>(1);

    const setLectureList = async () => {
      lectureList.value = [];
      showLectureList.value = [];

      let data = {
        userKey: userKey.value,
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

              if (selectValue.value === "pm") {
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

    const setTeacherList = async () => {
      let data = { search: "", lectureKey: "" };

      const result = await ApiClient(
        "/members/getTeacherList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          teacherList.value = result.resultData as teacherInterface[];
        }
      }

      if (teacherList.value.length > 10) {
        showTeacherList.value = teacherList.value.slice(0, 10);
        teacherPage.value = Math.ceil(teacherList.value.length / 10);
      } else {
        showTeacherList.value = teacherList.value;
        teacherPage.value = 0;
      }
    };

    const changeState = (state: string) => {
      selectValue.value = state;
    };

    //TODO pagination
    // const selectPage = (page: number) => {
    //   currentLecturePage.value = page;
    // };
    //
    // const changePage = (page: number) => {
    //   if (page === 1) currentLecturePage.value = currentLecturePage.value + 1;
    //   else currentLecturePage.value = currentLecturePage.value - 1;
    // };

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
      () => selectValue.value,
      async () => {
        await setLectureList();
      }
    );

    onMounted(async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherDetail.value = common.getItem(KEYS.LU) as teacherInterface;
        userKey.value = teacherDetail.value.teacherKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.STU) {
        userKey.value = common.getItem(KEYS.LU).studentKey;
      }

      if (props.listType === "LECTURE") await setLectureList();
      else if (props.listType === "ROOM") await setRoomList();
      else if (props.listType === "TEA") await setTeacherList();

      lectureColor.value = lectureColor.value.sort(() => Math.random() - 0.5);
    });

    return {
      teacherDetail,
      showLectureList,
      lectureColor,
      lecturePage,
      currentLecturePage,
      selectList,
      selectValue,
      showRoomList,
      roomPage,
      currentRoomPage,
      showTeacherList,
      teacherPage,
      currentTeacherPage,
      changeState,
      // selectPage,
      // changePage,
    };
  },
});
</script>

<template>
  <section class="select-lecture">
    <!--    강의 선택 -->
    <div class="select-lecture" v-if="listType === 'LECTURE'">
      <div class="select-lecture-label">
        <span class="select-lecture-label-teacher" v-if="teacherDetail">
          {{ teacherDetail?.name }} 강사님의 강의 현황
        </span>
        <span class="select-lecture-label-tip"
          >열람할 강의를 선택해주세요.</span
        >
        <div class="select-lecture-label-button">
          <select-button-component
            :select-list="selectList"
            :select-value="selectValue"
            @changeState="changeState"
          ></select-button-component>
        </div>
      </div>
      <div class="sap"></div>
      <div class="select-lecture-list">
        <div
          class="select-lecture-list-item"
          v-for="(item, index) in showLectureList"
          :style="{ backgroundColor: lectureColor[index] }"
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

    <!--    강의실 선택 -->
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
          :style="{ backgroundColor: lectureColor[index] }"
          @click="$emit('selectRoom', item)"
        >
          <span class="select-lecture-list-item-name">{{ item.name }}</span>
          <span class="select-lecture-list-item-target">{{ item.type }}</span>
          <span class="select-lecture-list-item-view"
            >열람하기 <i class="fa-solid fa-angles-right"></i
          ></span>
        </div>
      </div>
    </div>

    <!--    강사 선택 -->
    <div class="select-lecture" v-else-if="listType === 'TEA'">
      <div class="select-lecture-label">
        <span class="select-lecture-label-teacher"> 강사 목록 </span>
        <span class="select-lecture-label-tip"
          >열람할 강사를 선택해주세요.</span
        >
      </div>
      <div class="sap"></div>
      <div class="select-lecture-list">
        <div
          class="select-lecture-list-item"
          :style="{ backgroundColor: '#cccccc' }"
          @click="$emit('selectMe')"
          v-if="isConsult === 'Y'"
        >
          <span class="select-lecture-list-item-name">나의 내역</span>
          <span class="select-lecture-list-item-view"
            >열람하기 <i class="fa-solid fa-angles-right"></i
          ></span>
        </div>
        <div
          class="select-lecture-list-item"
          v-for="(item, index) in showTeacherList"
          :style="{ backgroundColor: lectureColor[index] }"
          @click="$emit('selectTeacher', item)"
        >
          <span class="select-lecture-list-item-name">{{ item.name }}</span>
          <span class="select-lecture-list-item-target">{{ item.part }}</span>
          <span class="select-lecture-list-item-view"
            >열람하기 <i class="fa-solid fa-angles-right"></i
          ></span>
        </div>
      </div>
    </div>
  </section>
</template>
