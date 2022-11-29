<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import LectureDetailComponent from "../components/lectureManage/LectureDetailComponent.vue";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
/*
[학생, 학부모, 관리자] [Main]강의 관리
 */
export default defineComponent({
  name: "LectureManagePage",
  components: { LectureDetailComponent },
  setup() {
    const route = useRoute();
    const currentCategory = ref<string | undefined>(undefined);
    const roomKey = ref<string>("");

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
      roomKey,
    };
  },
});
</script>

<template>
  <lecture-detail-component
    v-if="currentCategory === 'DETAIL'"
    :room-key="roomKey"
  ></lecture-detail-component>
</template>
