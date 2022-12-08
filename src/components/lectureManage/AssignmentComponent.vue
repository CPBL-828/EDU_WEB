<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface } from "../../lib/types";
import common from "../../lib/common";
export default defineComponent({
  name: "AssignmentComponent",
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
      <div class="assignment-section-body"></div>
    </div>
  </section>
</template>
