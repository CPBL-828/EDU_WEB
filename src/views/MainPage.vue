<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import MyInfoComponent from "../components/MyInfoComponent.vue";
import { adminInterface, teacherInterface } from "../lib/types";
import common from "../lib/common";
import { KEYS } from "../constant";
export default defineComponent({
  name: "MainPage",
  components: { MyInfoComponent },
  setup() {
    const userData = ref<teacherInterface | adminInterface>();

    onMounted(() => {
      userData.value = common.getItem(KEYS.LU);
    });
    return {
      userData,
    };
  },
});
</script>

<template>
  <section>
    <my-info-component
      :user-data="userData !== undefined ? userData : {}"
    ></my-info-component>
  </section>
</template>
