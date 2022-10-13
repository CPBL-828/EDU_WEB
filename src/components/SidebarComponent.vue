<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { KEYS, USER_KEY } from "../constant";
import CategoryItem from "./CategoryItem.vue";
import { categoryInterface } from "../lib/types";
import { TEA_MAIN, TEA_SUB } from "../dummyCategory";
export default defineComponent({
  name: "SidebarComponent",
  components: { CategoryItem },
  setup() {
    const userData = ref({ userType: "" });
    const mainItem = ref<categoryInterface[]>();
    const subItem = ref<categoryInterface[]>();
    const resultItem = ref<categoryInterface>();

    const selectMain = (main: categoryInterface) => {
      subItem.value?.map((item: categoryInterface) => {
        if (main.KEY === item.KEY) resultItem.value = item;
      });

      console.log(resultItem.value?.VALUE);
    };

    onMounted(() => {
      //TODO userData localStorage에서 받아오기
      userData.value = JSON.parse(localStorage.getItem(KEYS.LU));
      if (userData.value?.userType === USER_KEY.TEA) {
        mainItem.value = TEA_MAIN;
        subItem.value = TEA_SUB;
      }
    });
    return {
      mainItem,
      subItem,
      selectMain,
    };
  },
});
</script>

<template>
  <section class="sidebar">
    <div class="sidebar" v-if="mainItem">
      <div class="sidebar-user"></div>
      <div class="sidebar-category">
        <category-item
          :main-category="mainItem"
          @selectMain="selectMain"
        ></category-item>
      </div>
    </div>
  </section>
</template>
