<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import MyInfoComponent from "../components/myInfo/MyInfoComponent.vue";
import { adminInterface, teacherInterface } from "../lib/types";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
export default defineComponent({
  name: "MainPage",
  components: { MyInfoComponent },
  setup() {
    const adminState = ref(false);
    const userData = ref<teacherInterface | adminInterface>();

    onMounted(() => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.ADM)
        adminState.value = true;
      userData.value = common.getItem(KEYS.LU);
    });
    return {
      adminState,
      userData,
    };
  },
});
</script>

<template>
  <section v-if="userData">
    <my-info-component
      v-if="!adminState"
      :user-data="userData ? userData : {}"
    ></my-info-component>
  </section>
</template>
