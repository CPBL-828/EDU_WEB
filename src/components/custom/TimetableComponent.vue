<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { scheduleInterface } from "../../lib/types";
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
    const color = ref<Array<string>>([]);

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

    const clickMinute = (d: string, h: number, m: number) => {
      hour.value = h + 11;
      minute.value = (m - 1) * 10;

      console.log(d + ": " + hour.value + "-" + minute.value);
    };

    const clickBlock = (item: scheduleInterface) => {
      scheduleInfo.value = item;
    };

    watch(
      () => props.selectType,
      () => {
        setViewList();
      }
    );

    onMounted(() => {
      setViewList();
      if ((props.scheduleList as []).length > 0) {
        for (let i = 0; i < (props.scheduleList as []).length; i++) {
          color.value.push(
            "#" + Math.floor(Math.random() * 16777215).toString(16)
          );
        }
      }
    });

    return {
      blockState,
      viewScheduleList,
      scheduleInfo,
      clickMinute,
      clickBlock,
      color,
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
        @click="clickBlock(item)"
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
        @click="clickBlock(item)"
      >
        <span class="name">{{ item.name }}</span>
        <span>{{ item.subject }}</span>
      </div>
    </div>

    <div class="info">
      {{ scheduleInfo }}
    </div>
  </section>
</template>
