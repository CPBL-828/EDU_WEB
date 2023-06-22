<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import MyInfoComponent from "../components/myInfo/MyInfoComponent.vue";
import {
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
import { useRoute } from "vue-router";
import WorkReportComponent from "../components/myInfo/WorkReportComponent.vue";
import SuggestionComponent from "../components/myInfo/SuggestionComponent.vue";

export default defineComponent({
  name: "MyPlacePage",
  components: { SuggestionComponent, WorkReportComponent, MyInfoComponent },
  setup: function () {
    const route = useRoute();
    const userKey = ref<string | undefined>(undefined);
    const myInfoUser = ref<
      parentInterface | studentInterface | teacherInterface | undefined
    >(undefined);
    const workUser = ref<teacherInterface | undefined>(undefined);
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

      if (userKey.value === USER_KEY.STU) {
        myInfoUser.value = common.getItem(KEYS.LU) as studentInterface;
      } else if (userKey.value === USER_KEY.PAR) {
        myInfoUser.value = common.getItem(KEYS.LU) as parentInterface;
      } else if (userKey.value === USER_KEY.TEA) {
        myInfoUser.value = common.getItem(KEYS.LU) as teacherInterface;
        workUser.value = common.getItem(KEYS.LU) as teacherInterface;
      }
    });

    return {
      userKey,
      myInfoUser,
      workUser,
      currentCategory,
    };
  },
});
</script>

<template>
  <my-info-component
    v-if="userKey && myInfoUser && currentCategory === 'INFO'"
    :user-key="userKey"
    :user-data="myInfoUser"
  ></my-info-component>
  <work-report-component
    v-if="currentCategory === 'WORK'"
  ></work-report-component>
  <suggestion-component
    v-if="userKey && currentCategory === 'SUGGESTION'"
  ></suggestion-component>
</template>
