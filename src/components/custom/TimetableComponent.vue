<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { scheduleInterface } from "../../lib/types";
/*
@brief 시간표 컴포넌트
@props 강의 리스트, 오후/오전 중 선택된 상태 값
 */
export default defineComponent({
  name: "TimetableComponent",
  props: {
    scheduleList: {
      types: Array as PropType<Array<scheduleInterface>>,
      required: true,
    },
    selectType: {
      types: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const blockState = ref(false);
    const viewScheduleList = ref<Array<scheduleInterface>>([]);
    const scheduleInfo = ref<scheduleInterface>();
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

    const setViewList = () => {
      if (props.scheduleList) {
        blockState.value = true;
        viewScheduleList.value = [];
        (props.scheduleList as []).map((item: scheduleInterface) => {
          if (props.selectType === "pm") {
            if (item.start >= 13) {
              viewScheduleList.value.push(item);
            }
          } else {
            if (item.start < 13) {
              viewScheduleList.value.push(item);
            }
          }
        });
      }
    };

    watch(
      () => props.selectType,
      () => {
        setViewList();
      }
    );

    watch(
      () => props.scheduleList as [],
      () => {
        setViewList();
      }
    );

    onMounted(() => {
      setViewList();

      color.value = color.value.sort(() => Math.random() - 0.5);
    });

    return {
      blockState,
      viewScheduleList,
      scheduleInfo,
      color,
    };
  },
});
</script>

<template>
  <section class="schedule" v-if="viewScheduleList">
    <div class="all">
      <div class="time-label">
        <span
          v-for="i in selectType === 'am'
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            : [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]"
          >{{ i < 10 ? "0" + i : i }}</span
        >
      </div>
      <div
        class="one-day"
        v-for="d in ['월', '화', '수', '목', '금', '토', '일']"
      >
        <div class="day">{{ d }}</div>
        <div class="one-hour" v-for="h in 12">
          <div class="ten-minute" v-for="m in 6"></div>
        </div>
      </div>
    </div>
    <div class="block">
      <div
        v-if="blockState && selectType === 'pm'"
        class="schedule-block"
        id="block"
        v-for="(item, index) in viewScheduleList"
        :style="{
          backgroundColor: color[index],
          position: 'absolute',
          height: item.duration + 'px',
          top:
            (item.start - 12) * 6 * 10 +
            (item.start - 12 + 1) -
            60 +
            item.minute +
            'px',
          left: 120 + (item.day - 1) * 116 + 4 + 'px',
        }"
        @click="$emit('clickSchedule', item)"
      >
        <span class="name">{{ item.lectureName }}</span>
        <span>{{ item.subject }}</span>
      </div>
      <div
        v-if="blockState && selectType === 'am'"
        class="schedule-block"
        id="block"
        v-for="(item, index) in viewScheduleList"
        :style="{
          backgroundColor: color[index],
          position: 'absolute',
          height: item.duration + 'px',
          top: item.start * 6 * 10 + (item.start + 1) - 60 + item.minute + 'px',
          left: 120 + (item.day - 1) * 116 + 4 + 'px',
        }"
        @click="$emit('clickSchedule', item)"
      >
        <span class="name">{{ item.lectureName }}</span>
        <span>{{ item.subject }}</span>
      </div>
    </div>
  </section>
</template>
