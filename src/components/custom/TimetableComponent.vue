<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { scheduleInterface } from "../../lib/types";
import { ApiClient } from "../../axios";
import common from "../../lib/common";
import { KEYS } from "../../constant";
export default defineComponent({
  name: "TimetableComponent",
  setup() {
    const hour = ref<number>(0);
    const minute = ref<number>(0);
    const blockState = ref(false);
    const amSchedule = ref<Array<scheduleInterface>>([]);
    const pmSchedule = ref<Array<scheduleInterface>>([]);
    const scheduleInfo = ref<scheduleInterface>();
    const color = ref<Array<string>>([]);

    const clickMinute = (d: string, h: number, m: number) => {
      hour.value = h + 11;
      minute.value = (m - 1) * 10;

      console.log(d + ": " + hour.value + "-" + minute.value);
    };

    const clickBlock = (item: scheduleInterface) => {
      scheduleInfo.value = item;
    };

    onMounted(async () => {
      blockState.value = true;

      let teacherKey = common.getItem(KEYS.LU).teacherKey;
      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson({ userKey: teacherKey, search: "" })
      );

      result.resultData.map((item: scheduleInterface) => {
        item.start = Number(item.startTime.substring(0, 2));
        item.minute = Number(item.startTime.substring(3, 5));

        if (item.start >= 13) {
          pmSchedule.value?.push(item);
        } else {
          amSchedule.value?.push(item);
        }

        for (let i = 0; i < pmSchedule.value.length; i++) {
          color.value.push(
            "#" + Math.floor(Math.random() * 16777215).toString(16)
          );
        }
      });
    });

    return {
      blockState,
      amSchedule,
      pmSchedule,
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
    <div class="block" v-if="pmSchedule || amSchedule">
      <div
        v-if="blockState"
        class="schedule-block"
        id="block"
        v-for="(item, index) in pmSchedule"
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
    </div>

    <div class="info">
      {{ scheduleInfo }}
    </div>
  </section>
</template>
