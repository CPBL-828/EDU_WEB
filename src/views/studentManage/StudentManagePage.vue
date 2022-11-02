<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import common from "../../lib/common";
import UserInfoComponent from "../../components/UserInfoComponent.vue";
import { studentInterface } from "../../lib/types";

/*
@brief 강사 및 관리자 권한의 메인 카테고리 [학목 관리]에서 접근할 수 있는 페이지들 표시
 */
export default defineComponent({
  name: "StudentManagePage",
  components: { UserInfoComponent },
  setup() {
    const route = useRoute();
    const studentInfo = ref<Array<studentInterface> | undefined>(undefined);
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
      studentInfo,
      currentCategory,
    };
  },
});
</script>

<template>
  <user-info-component
    v-if="currentCategory === 'S-INFO'"
    :user-data="studentInfo !== undefined ? studentInfo : []"
  ></user-info-component>
</template>
