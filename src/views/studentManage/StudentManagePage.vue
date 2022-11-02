<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import UserInfoComponent from "../../components/UserInfoComponent.vue";

/*
@brief 강사 및 관리자 권한의 메인 카테고리 [학목 관리]에서 접근할 수 있는 페이지들 표시
 */
export default defineComponent({
  name: "StudentManagePage",
  components: { UserInfoComponent },
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
</template>
