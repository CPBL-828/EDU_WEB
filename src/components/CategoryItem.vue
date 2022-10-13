<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { categoryInterface } from "../lib/types";
import { KEYS, USER_KEY } from "../constant";
import { TEA_MAIN, TEA_SUB } from "../dummyCategory";
export default defineComponent({
  name: "CategoryItem",
  setup() {
    //TODO userInterface
    const userData = ref({ userType: "" });
    const mainItem = ref<categoryInterface[]>();
    const subItem = ref<categoryInterface[]>();

    onMounted(() => {
      userData.value = JSON.parse(localStorage.getItem(KEYS.LU));
      if (userData.value?.userType === USER_KEY.TEA) {
        mainItem.value = TEA_MAIN;
        subItem.value = TEA_SUB;
      }
    });
    return {
      mainItem,
    };
  },
});
</script>

<template>
  <section>
    <div class="category">
      <div class="category-item" v-for="item in mainItem">
        <i :class="item.ICON"></i>
        {{ item.VALUE }}
      </div>
    </div>
  </section>
</template>
