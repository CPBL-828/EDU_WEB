<script lang="ts">
import { defineComponent, PropType } from "vue";
import { categoryInterface } from "../../lib/types";
export default defineComponent({
  name: "CategoryItem",
  props: {
    mainCategory: {
      type: Array as PropType<Array<categoryInterface>>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <section class="category">
    <div class="category">
      <div
        class="category-item"
        v-for="item in mainCategory"
        @click="$emit('selectMain', item)"
      >
        <i :class="item.ICON"></i>
        {{ item.VALUE }}
      </div>
    </div>
  </section>
</template>
