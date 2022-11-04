<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import CurrentScheduleComponent from "../../components/scheduleManage/CurrentScheduleComponent.vue";

export default defineComponent({
  name: "ScheduleManagePage.vue",
  components: { CurrentScheduleComponent },
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
  <!--  <current-schedule-component.vue-->
  <!--    v-if="currentCategory === 'CURRENT'"-->
  <!--  ></current-schedule-component.vue>-->
</template>
