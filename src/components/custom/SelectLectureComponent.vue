<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  scheduleInterface,
  teacherInterface,
} from "../../lib/types";
export default defineComponent({
  name: "SelectLectureComponent",
  components: { SelectButtonComponent },
  setup() {
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
    const page = ref<number>(0);
    const currentPage = ref<number>(1);
    const selectItem: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectState = ref("pm");

    const setLectureList = async () => {
      lectureList.value = [];
      showLectureList.value = [];
      let data = {
        userKey: teacherInfo.value?.teacherKey,
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
                else lectureList.value.push(item);
              }
            }
          });
        }
      }

      if (lectureList.value.length > 10) {
        showLectureList.value = lectureList.value.slice(0, 10);
        page.value = Math.ceil(lectureList.value.length / 10);
      } else {
        showLectureList.value = lectureList.value;
        page.value = 0;
      }
    };

    const changeState = (v: string) => {
      selectState.value = v;
    };

    const selectPage = (n: number) => {
      currentPage.value = n;
    };

    const changePage = (n: number) => {
      if (n === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    watch(
      () => currentPage.value,
      () => {
        showLectureList.value = lectureList.value.slice(
          10 * currentPage.value - 10,
          10 * currentPage.value
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

      await setLectureList();

      color.value = color.value.sort(() => Math.random() - 0.5);
    });

    return {
      teacherInfo,
      showLectureList,
      color,
      page,
      currentPage,
      selectItem,
      selectState,
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
    <div class="select-lecture">
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
  </section>
</template>
