<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { defaultInterface } from "../../lib/types";
import common from "../../lib/common";
import { KEYS } from "../../constant";

/*
@brief common.ts의 findCategory 함수를 활용하여 현재 카테고리 경로를 표시하는 헤더
 */
export default defineComponent({
  name: "HeaderComponent",
  setup() {
    const route = useRoute();
    const userKey = ref<string | undefined>(undefined);
    const showRoute = ref(false);
    const category = ref<Array<defaultInterface> | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        if (route.path === "/main") {
          showRoute.value = false;
        } else {
          showRoute.value = true;
          category.value = common.findCategory();
        }
      }
    );

    onMounted(() => {
      if (common.getItem(KEYS.UK)) {
        userKey.value = common.getItem(KEYS.UK).userKey;
      }

      if (route.path === "/main") {
        showRoute.value = false;
      } else {
        showRoute.value = true;
        category.value = common.findCategory();
      }
    });

    return {
      showRoute,
      category,
    };
  },
});
</script>

<template>
  <section class="header">
    <div class="header">
      <div class="path" v-if="showRoute">
        <i class="fa-solid fa-bars"></i>
        {{ category[0]["VALUE"]
        }}<i class="fa-solid fa-angle-right" v-if="category[1]"></i
        >{{ category[1]["VALUE"] }}
      </div>
    </div>
  </section>
</template>
