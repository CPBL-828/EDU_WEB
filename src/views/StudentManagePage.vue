<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import UserInfoComponent from "../components/UserInfoComponent.vue";
import AnalysisComponent from "../components/studentManage/AnalysisComponent.vue";
import ConsultComponent from "../components/studentManage/ConsultComponent.vue";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
import SuggestionComponent from "../components/myInfo/SuggestionComponent.vue";
import SuggestionManageComponent from "../components/SuggestionManageComponent.vue";
import GroupManagement from "../components/studentManage/GroupManagementComponent.vue";

export default defineComponent({
  name: "StudentManagePage",
  components: {
    GroupManagement,
    SuggestionManageComponent,
    SuggestionComponent,
    ConsultComponent,
    UserInfoComponent,
    AnalysisComponent,
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

      if (common.getItem(KEYS.UK).userKey)
        if (
          common.getItem(KEYS.UK).userKey === USER_KEY.ETC_ADM ||
          common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM
        )
          adminState.value = true;
    });

    return {
      currentCategory,
      adminState,
    };
  },
});
</script>

<template>
  <user-info-component
    v-if="currentCategory === 'S-INFO'"
    view-user="STU"
  ></user-info-component>
  <consult-component
    v-if="currentCategory === 'CONSULT'"
    :admin-state="adminState"
  >
  </consult-component>
  <analysis-component
    v-if="currentCategory === 'ANALYSIS'"
    :admin-state="adminState"
  ></analysis-component>
  <suggestion-manage-component
    v-if="currentCategory === 'S-SUGGESTION'"
    show-user="STU"
  ></suggestion-manage-component>
  <group-management v-if="currentCategory === 'CLASS'"></group-management>
</template>
