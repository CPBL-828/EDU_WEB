<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { scheduleInterface } from "../../lib/types";
export default defineComponent({
  name: "TimetableComponent",
  setup() {
    const hour = ref<number>(0);
    const minute = ref<number>(0);
    const blockState = ref(false);

    const scheduleData: scheduleInterface[] = [
      {
        name: "수업1",
        time: "12-20",
        startTime: 0,
        startMinute: 0,
        startDay: 3,
        duration: 120,
      },
      {
        name: "수업2",
        time: "13-20",
        startTime: 0,
        startMinute: 0,
        startDay: 5,
        duration: 140,
      },
      {
        name: "수업3",
        time: "16-00",
        startTime: 0,
        startMinute: 0,
        startDay: 2,
        duration: 60,
      },
      {
        name: "수업4",
        time: "15-10",
        startTime: 0,
        startMinute: 0,
        startDay: 6,
        duration: 120,
      },
    ];
    const scheduleInfo = ref<scheduleInterface>();

    const clickMinute = (d: string, h: number, m: number) => {
      hour.value = h + 11;
      minute.value = (m - 1) * 10;

      console.log(d + ": " + hour.value + "-" + minute.value);
    };

    const clickBlock = (item: scheduleInterface) => {
      scheduleInfo.value = item;
    };

    onMounted(() => {
      // let hourB = (sHour - 12) * 6 * 10 + (sHour - 12 + 1);

      scheduleData.map((schedule: scheduleInterface) => {
        schedule.startTime = Number(schedule.time.substring(0, 2));
        schedule.startMinute = Number(schedule.time.substring(3, 5));
      });

      blockState.value = true;

      // const block: HTMLElement = document.getElementById(
      //   "block"
      // ) as HTMLElement;

      // block.style.height = duration + 1 + "px";
      // block.style.top = hourB + sMinute + "px";
      // block.style.left = 120 + (day - 1) * 82 + "px";
    });

    return {
      blockState,
      scheduleData,
      scheduleInfo,
      clickMinute,
      clickBlock,
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
          <div
            class="ten-minute"
            v-for="m in 6"
            @click="clickMinute(d, h, m)"
          ></div>
        </div>
      </div>
    </div>
    <!--    <div class="schedule-block" id="block" @click="clickBlock()"></div>-->
    <div class="block" v-if="scheduleData">
      <div
        v-if="blockState"
        class="schedule-block"
        v-for="item in scheduleData"
        :style="{
          position: 'absolute',
          height: item.duration + 'px',
          top:
            (item.startTime - 12) * 6 * 10 +
            (item.startTime - 12 + 1) +
            item.startMinute +
            'px',
          left: 120 + (item.startDay - 1) * 81 + 4 + 'px',
        }"
        @click="clickBlock(item)"
      >
        {{ item.name }}
      </div>
    </div>

    <div class="info">
      {{ scheduleInfo }}
    </div>
  </section>
</template>
