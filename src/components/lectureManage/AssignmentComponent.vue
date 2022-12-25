<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import common from "../../lib/common";
import SelectListComponent from "../custom/SelectListComponent.vue";
export default defineComponent({
  name: "AssignmentComponent",
  components: { SelectListComponent },
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
  <section class="assignment">
    <div class="assignment-section">
      <div class="assignment-section-tag">
        {{
          category
            ? category[1]["VALUE"]
              ? category[1]["VALUE"]
              : category[0]["VALUE"]
            : ""
        }}
      </div>
      <div class="assignment-section-body">
        <div class="assignment-section-body-lecture" v-if="!selectState">
          <select-list-component
            list-type="LECTURE"
            @selectLecture="selectLecture"
          ></select-list-component>
        </div>
      </div>
    </div>
  </section>
</template>
