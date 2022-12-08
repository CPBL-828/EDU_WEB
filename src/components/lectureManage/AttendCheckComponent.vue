<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface } from "../../lib/types";
import common from "../../lib/common";
export default defineComponent({
  name: "AttendCheckComponent",
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
  <section class="check">
    <div class="check-section">
      <div class="check-section-tag">
        {{
          category
            ? category[1]["VALUE"]
              ? category[1]["VALUE"]
              : category[0]["VALUE"]
            : ""
        }}
      </div>
      <div class="check-section-body"></div>
    </div>
  </section>
</template>
