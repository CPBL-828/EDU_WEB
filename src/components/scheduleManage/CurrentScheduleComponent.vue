<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import common from "../../lib/common";
import { defaultInterface } from "../../lib/types";
import TimetableComponent from "../custom/TimetableComponent.vue";
export default defineComponent({
  name: "CurrentScheduleComponent.vue",
  components: { TimetableComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);

    onMounted(() => {
      category.value = common.findCategory();
    });

    return {
      category,
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
          <timetable-component></timetable-component>
        </div>
      </div>
    </div>
  </section>
</template>
