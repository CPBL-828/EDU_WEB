<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import common from "../../lib/common";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import TimetableComponent from "../custom/TimetableComponent.vue";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
export default defineComponent({
  name: "CurrentScheduleComponent.vue",
  components: { TimetableComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const scheduleList = ref<Array<scheduleInterface>>([]);
    const selectState = ref("pm");

    const changeState = (v: string) => {
      selectState.value = v;
    };

    onMounted(async () => {
      category.value = common.findCategory();

      let teacherKey = "";
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey = common.getItem(KEYS.LU).teacherKey;
      }
      let data = { userKey: teacherKey, search: "" };
      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result.count > 0) {
        result.resultData.map((item: scheduleInterface) => {
          item.start = Number(item.startTime.substring(0, 2));
          item.minute = Number(item.startTime.substring(3, 5));
        });
      }

      scheduleList.value = result.resultData as scheduleInterface[];
    });

    return {
      category,
      scheduleList,
      selectState,
      changeState,
    };
  },
});
</script>

<template>
  <section class="current-schedule">
    <div class="current-schedule">
      <div class="current-schedule-section">
        <div class="current-schedule-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="current-schedule-section-body">
          <div class="suggestion-section-body-state">
            <span
              :class="
                selectState === 'pm'
                  ? 'suggestion-section-body-state-ok-active'
                  : 'suggestion-section-body-state-ok'
              "
              @click="changeState('pm')"
              >오후</span
            >
            <span
              :class="
                selectState === 'am'
                  ? 'suggestion-section-body-state-wait-active'
                  : 'suggestion-section-body-state-wait'
              "
              @click="changeState('am')"
              >오전</span
            >
          </div>
          <div class="current-schedule-section-body-timetable">
            <timetable-component
              v-if="scheduleList.length > 0"
              :schedule-list="scheduleList"
              :select-type="selectState"
            ></timetable-component>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
