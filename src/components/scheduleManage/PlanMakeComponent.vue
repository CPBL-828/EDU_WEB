<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import common from "../../lib/common";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import { ApiClient } from "../../axios";
import { KEYS, USER_KEY } from "../../constant";
export default defineComponent({
  name: "PlanMakeComponent",
  setup() {
    const userKey = ref<string | undefined>(undefined);
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const header: defaultInterface[] = [
      { KEY: "name", VALUE: "강의명" },
      { KEY: "day", VALUE: "요일" },
      { KEY: "time", VALUE: "시간" },
      { KEY: "planner", VALUE: "강의 계획서 작성" },
    ];
    const waitingLectureList = ref<Array<scheduleInterface> | undefined>(
      undefined
    );

    const setLectureList = async () => {
      let data = { userKey: userKey.value, search: "", roomKey: "" };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );
      console.log("강의 계획서 작성: ", result);
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.LU)) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
          userKey.value = common.getItem(KEYS.LU).teacherKey;
        }
      }

      await setLectureList();
    });

    return {
      category,
      header,
    };
  },
});
</script>

<template>
  <section class="planner">
    <div class="planner">
      <div class="planner-section">
        <div class="planner-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="planner-section-body">
          <table class="planner-section-body-list">
            <thead>
              <tr>
                <th class="name">{{ header[0].VALUE }}</th>
                <th class="day">{{ header[1].VALUE }}</th>
                <th class="time">{{ header[2].VALUE }}</th>
                <th class="planner">{{ header[3].VALUE }}</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </section>
</template>
