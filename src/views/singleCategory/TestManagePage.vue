<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import common from "../../lib/common";
import SelectListComponent from "../../components/custom/SelectListComponent.vue";
import DataListComponent from "../../components/custom/DataListComponent.vue";
export default defineComponent({
  name: "TestManagePage",
  components: { DataListComponent, SelectListComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const selectState = ref(false);
    const lectureInfo = ref<scheduleInterface | undefined>(undefined);
    const testHeader: defaultInterface[] = [
      { KEY: "DATE", VALUE: "시험 일자" },
      { KEY: "TYPE", VALUE: "시험 유형" },
      { KEY: "STATE", VALUE: "상태" },
      { KEY: "FILE", VALUE: "시험 파일" },
    ];
    // const testList;

    const selectLecture = (i: scheduleInterface) => {
      lectureInfo.value = i;
      selectState.value = true;
    };

    onMounted(() => {
      category.value = common.findCategory();
    });

    return {
      category,
      selectState,
      lectureInfo,
      testHeader,
      selectLecture,
    };
  },
});
</script>

<template>
  <section class="test">
    <div class="test">
      <div class="test-section">
        <div class="test-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="test-section-body">
          <div class="test-section-body-lecture" v-if="!selectState">
            <select-list-component
              list-type="LECTURE"
              @selectLecture="selectLecture"
            ></select-list-component>
          </div>
          <div class="test-section-body-schedule" v-else>
            <div class="test-section-body-schedule-title">
              <span class="lecture-name">{{ lectureInfo?.lectureName }}</span>
              <span class="subject-name">{{ lectureInfo?.subject }}</span>
            </div>
            <div class="test-section-body-schedule-list">
              <data-list-component
                :header="testHeader"
                list-type="test"
                :data-list="[]"
                :total-cnt="0"
              ></data-list-component>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
