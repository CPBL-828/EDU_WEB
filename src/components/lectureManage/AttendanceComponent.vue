<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import common from "../../lib/common";
import SelectLectureComponent from "../custom/SelectLectureComponent.vue";
import { KEYS, USER_KEY } from "../../constant";
import DataListComponent from "../custom/DataListComponent.vue";
export default defineComponent({
  name: "AttendanceComponent",
  components: { DataListComponent, SelectLectureComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherKey = ref<string>("");
    const selectState = ref(false);
    const lectureInfo = ref<scheduleInterface | undefined>(undefined);
    const header: Array<defaultInterface> = [
      { KEY: "name", VALUE: "이름" },
      { KEY: "current", VALUE: "현재 수업 일수" },
      { KEY: "attendance", VALUE: "출석일" },
    ];

    const selectLecture = (item: scheduleInterface) => {
      lectureInfo.value = item;
      selectState.value = true;
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey.value = common.getItem(KEYS.LU).teacherKey;
      }
    });

    return {
      category,
      selectState,
      lectureInfo,
      header,
      selectLecture,
    };
  },
});
</script>

<template>
  <section class="attendance">
    <div class="attendance">
      <div class="attendance-section">
        <div class="attendance-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="attendance-section-body">
          <div class="attendance-section-body-lecture" v-if="!selectState">
            <select-lecture-component
              @selectLecture="selectLecture"
            ></select-lecture-component>
          </div>
          <div class="attendance-section-body-list" v-if="selectState">
            <span class="attendance-section-body-list-title">출석 현황</span>
            <span class="attendance-section-body-list-lecture">{{
              lectureInfo?.lectureName
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
