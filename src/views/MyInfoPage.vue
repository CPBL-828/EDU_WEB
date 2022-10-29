<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import MyInfoComponent from "../components/myInfo/MyInfoComponent.vue";
import { adminInterface, teacherInterface } from "../lib/types";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
import { useRoute } from "vue-router";
import WorkReportComponent from "../components/myInfo/WorkReportComponent.vue";

export default defineComponent({
  name: "MyInfoPage",
  components: { WorkReportComponent, MyInfoComponent },
  setup: function () {
    const route = useRoute();
    const userKey = ref<string | undefined>(undefined);
    const userData = ref<teacherInterface | adminInterface>();
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

      if (userKey.value === USER_KEY.TEA) {
        userData.value = common.getItem(KEYS.LU) as teacherInterface;
      }
    });
    return {
      userKey,
      userData,
      currentCategory,
    };
  },
});
</script>

<template>
  <my-info-component
    v-if="currentCategory === 'INFO'"
    :user-key="userKey"
    :user-data="userData ? userData : {}"
  ></my-info-component>
  <work-report-component
    v-if="currentCategory === 'WORK'"
    :user-key="userKey"
    :user-data="userData ? userData : {}"
  ></work-report-component>
  <div v-if="currentCategory === 'SUGGESTION'">건의사항</div>
</template>
