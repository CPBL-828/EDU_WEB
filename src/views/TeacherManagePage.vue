<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import CardListComponent from "../components/CardListComponent.vue";
import { useRoute } from "vue-router";
import { teacherInterface } from "../lib/types";
import { KEYS } from "../constant";
import common from "../lib/common";

/*
@brief 관리자 권한의 메인 카테고리 [강사 관리]에서 접근할 수 있는 페이지들 표시
 */
export default defineComponent({
  name: "TeacherManagePage",
  components: { CardListComponent },
  setup() {
    const route = useRoute();
    const userKey = ref<string | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const currentCategory = ref<string | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        currentCategory.value = route.path.split("/")[2]?.toUpperCase();
      }
    );

    onMounted(() => {
      currentCategory.value = route.path.split("/")[2]?.toUpperCase();
      userKey.value = common.getItem(KEYS.UK).userKey;
    });

    return {
      userKey,
      teacherInfo,
      currentCategory,
    };
  },
});
</script>

<template>
  <card-list-component
    v-if="currentCategory === 'T-INFO'"
  ></card-list-component>
</template>
