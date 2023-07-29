<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import UserInfoComponent from "../components/UserInfoComponent.vue";
import SuggestionManageComponent from "../components/SuggestionManageComponent.vue";
import WorkReportComponent from "../components/myInfo/WorkReportComponent.vue";

export default defineComponent({
  name: "TeacherManagePage",
  components: {
    WorkReportComponent,
    SuggestionManageComponent,
    UserInfoComponent,
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
  <user-info-component
    v-if="currentCategory === 'T-INFO'"
    view-user="TEA"
  ></user-info-component>
  <suggestion-manage-component
    v-if="currentCategory === 'T-SUGGESTION'"
    show-user="TEA"
  ></suggestion-manage-component>
  <work-report-component
    v-if="currentCategory === 'WORK'"
  ></work-report-component>
</template>
