<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import MyInfoComponent from "../components/myInfo/MyInfoComponent.vue";
import { adminInterface, teacherInterface } from "../lib/types";
import common from "../lib/common";
import { KEYS } from "../constant";
import { useRoute } from "vue-router";
import WorkReportComponent from "../components/myInfo/WorkReportComponent.vue";
export default defineComponent({
  name: "MyInfoPage",
  components: { WorkReportComponent, MyInfoComponent },
  setup() {
    const route = useRoute();
    const userData = ref<teacherInterface | adminInterface>();
    const currentCategory = ref<string | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        currentCategory.value = route.path.split("/")[2]?.toUpperCase();
        console.log(currentCategory.value);
      }
    );

    onMounted(() => {
      userData.value = common.getItem(KEYS.LU);
    });
    return {
      userData,
      currentCategory,
    };
  },
});
</script>

<template>
  <section>
    <my-info-component
      v-if="currentCategory !== 'WORK' && currentCategory !== 'SUGGESTION'"
      :user-data="userData ? userData : {}"
    ></my-info-component>
    <div v-if="currentCategory === 'WORK'">출근부</div>
    <div v-if="currentCategory === 'SUGGESTION'">건의사항</div>
  </section>
</template>
