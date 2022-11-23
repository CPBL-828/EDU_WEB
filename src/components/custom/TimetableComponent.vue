<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from "vue";
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
    const hour = ref<number>(0);
    const minute = ref<number>(0);
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

    // const clickMinute = (d: string, h: number, m: number) => {
    //   hour.value = h + 11;
    //   minute.value = (m - 1) * 10;
    //
    //   console.log(d + ": " + hour.value + "-" + minute.value);
    // };

    watch(
      () => props.selectType,
      () => {
        setViewList();
      }
    );

    onMounted(() => {
      watch(
        () => props.scheduleList,
        () => {
          if (props.scheduleList) {
            setViewList();
          }
        }
      );

      color.value = color.value.sort(() => Math.random() - 0.5);
    });

    return {
      blockState,
      viewScheduleList,
      scheduleInfo,
      color,
      // clickMinute,
    };
  },
});
</script>

<template>
  <section class="schedule">
    <div class="all">
      <div class="time-label">
        <span v-for="i in 12">{{ i < 10 ? "0" + i : i }}</span>
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
    <!--    <div class="schedule-block" id="block" @click="clickBlock()"></div>-->
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
        <span class="name">{{ item.name }}</span>
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
        <span class="name">{{ item.name }}</span>
        <span>{{ item.subject }}</span>
      </div>
    </div>
  </section>
</template>
