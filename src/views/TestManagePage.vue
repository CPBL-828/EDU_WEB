<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface, scheduleInterface } from "../lib/types";
import common from "../lib/common";
import SelectLectureComponent from "../components/custom/SelectLectureComponent.vue";
export default defineComponent({
  name: "TestManagePage",
  components: { SelectLectureComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const selectState = ref(false);

    const selectLecture = (i: scheduleInterface) => {
      selectState.value = true;
    };

    onMounted(() => {
      category.value = common.findCategory();
    });

    return {
      category,
      selectState,
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
            <select-lecture-component
              list-type="LECTURE"
              @selectLecture="selectLecture"
            ></select-lecture-component>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
