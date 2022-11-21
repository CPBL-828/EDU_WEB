<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import UserInfoComponent from "../components/UserInfoComponent.vue";
import AnalysisComponent from "../components/studentManage/AnalysisComponent.vue";
import ConsultComponent from "../components/studentManage/ConsultComponent.vue";
/*
@brief [강사, 관리자] [Main]학생 관리
       선택한 [Sub]에 따라 페이지 표시
 */
export default defineComponent({
  name: "StudentManagePage",
  components: { ConsultComponent, UserInfoComponent, AnalysisComponent },
  setup() {
    const route = useRoute();
    const currentCategory = ref<string | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        currentCategory.value = route.path.split("/")[2]?.toUpperCase();
      }
    );

    onMounted(async () => {
      currentCategory.value = route.path.split("/")[2]?.toUpperCase();
    });

    return {
      currentCategory,
    };
  },
});
</script>

<template>
  <user-info-component
    v-if="currentCategory === 'S-INFO'"
    view-user="STU"
  ></user-info-component>
  <consult-component v-if="currentCategory === 'CONSULT'"> </consult-component>
  <analysis-component
    v-if="currentCategory === 'ANALYSIS'"
  ></analysis-component>
</template>
