<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { defaultInterface } from "../../lib/types";
import common from "../../lib/common";

export default defineComponent({
  name: "HeaderComponent",
  setup() {
    const route = useRoute();
    const viewRouteState = ref(false);
    const currentCategory = ref<Array<defaultInterface> | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        if (route.path === "/main") {
          viewRouteState.value = false;
        } else {
          viewRouteState.value = true;
          currentCategory.value = common.findCategory();
        }
      }
    );

    onMounted(() => {
      if (route.path === "/main") {
        viewRouteState.value = false;
      } else {
        viewRouteState.value = true;
        currentCategory.value = common.findCategory();
      }
    });

    return {
      viewRouteState,
      currentCategory,
    };
  },
});
</script>

<template>
  <section class="header">
    <div class="header">
      <div class="path" v-if="viewRouteState && currentCategory">
        <i class="fa-solid fa-bars"></i>
        {{ currentCategory[0] ? currentCategory[0]["VALUE"] : "" }}
        <i
          class="fa-solid fa-angle-right"
          v-if="currentCategory[1]['VALUE']"
        ></i>
        {{ currentCategory[1] ? currentCategory[1]["VALUE"] : "" }}
      </div>
    </div>
  </section>
</template>
