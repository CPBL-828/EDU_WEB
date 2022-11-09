<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CurrentScheduleComponent from "../components/scheduleManage/CurrentScheduleComponent.vue";
import ScheduleAskComponent from "../components/scheduleManage/ScheduleAskComponent.vue";
import PlanMakeComponent from "../components/scheduleManage/PlanMakeComponent.vue";
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
  <current-schedule-component
    v-if="currentCategory === 'CURRENT'"
  ></current-schedule-component>
  <schedule-ask-component
    v-if="currentCategory === 'ASK'"
  ></schedule-ask-component>
  <plan-make-component v-if="currentCategory === 'PLAN'"></plan-make-component>
</template>
