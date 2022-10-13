<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { KEYS } from "../constant";
import CategoryItem from "./CategoryItem.vue";
export default defineComponent({
  name: "SidebarComponent",
  components: { CategoryItem },
  setup() {
    onMounted(() => {});
    return {};
  },
});
</script>

<template>
  <section class="sidebar">
    <div class="sidebar">
      <div class="sidebar-user"></div>
      <div class="sidebar-category">
        <category-item></category-item>
      </div>
    </div>
  </section>
</template>
