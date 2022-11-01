<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import TeacherInfoPage from "./TeacherInfoPage.vue";
import { useRoute } from "vue-router";
import common from "../../lib/common";

/*
@brief 관리자 권한의 메인 카테고리 [강사 관리]에서 접근할 수 있는 페이지들 표시
 */
export default defineComponent({
  name: "TeacherManagePage",
  components: { TeacherInfoPage },
  setup() {
    const route = useRoute();
    const currentCategory = ref<string | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        currentCategory.value = route.path.split("/")[2]?.toUpperCase();
      }
    );

    onMounted(() => {
      currentCategory.value = route.path.split("/")[2]?.toUpperCase();
    });

    return {
      currentCategory,
    };
  },
});
</script>

<template>
  <teacher-info-page v-if="currentCategory === 'T-INFO'"></teacher-info-page>
</template>
