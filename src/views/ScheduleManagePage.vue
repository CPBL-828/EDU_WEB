<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CurrentScheduleComponent from "../components/scheduleManage/CurrentScheduleComponent.vue";
import ScheduleAskComponent from "../components/scheduleManage/ScheduleAskComponent.vue";
import PlanMakeComponent from "../components/scheduleManage/PlanMakeComponent.vue";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
/*
@brief [강사, 관리자] [Main]시간표 관리
       선택한 [Sub]에 따라 페이지를 표시
 */
export default defineComponent({
  name: "ScheduleManagePage.vue",
  components: {
    PlanMakeComponent,
    ScheduleAskComponent,
    CurrentScheduleComponent,
  },
  setup() {
    const route = useRoute();
    const currentCategory = ref<string | undefined>(undefined);
    const adminState = ref(false);

    watch(
      () => route.path,
      () => {
        currentCategory.value = route.path.split("/")[2]?.toUpperCase();
      }
    );

    onMounted(async () => {
      currentCategory.value = route.path.split("/")[2]?.toUpperCase();

      if (
        common.getItem(KEYS.UK).userKey ===
        (USER_KEY.KYO_ADM || USER_KEY.ETC_ADM)
      ) {
        adminState.value = true;
      }
    });

    return {
      currentCategory,
      adminState,
    };
  },
});
</script>

<template>
  <current-schedule-component
    :admin-state="adminState"
    v-if="currentCategory === 'CURRENT' || currentCategory === 'ALL'"
  ></current-schedule-component>
  <schedule-ask-component
    v-if="currentCategory === 'ASK'"
  ></schedule-ask-component>
  <plan-make-component
    v-if="currentCategory === 'PLAN' || currentCategory === 'WRITE'"
  ></plan-make-component>
</template>
