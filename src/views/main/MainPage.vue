<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import MyInfoComponent from "../../components/myInfo/MyInfoComponent.vue";
import {
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import NoticePage from "../singleCategory/NoticePage.vue";
import AdminMainComponent from "../../components/main/AdminMainComponent.vue";

export default defineComponent({
  name: "MainPage",
  components: { AdminMainComponent, NoticePage, MyInfoComponent },
  setup() {
    const adminState = ref(false);
    const userKey = ref<string | undefined>(undefined);
    const userDetail = ref<
      parentInterface | studentInterface | teacherInterface | undefined
    >(undefined);

    onMounted(() => {
      if (common.getItem(KEYS.UK)) {
        userKey.value = common.getItem(KEYS.UK).userKey;
        if (
          common.getItem(KEYS.UK).userKey === USER_KEY.ETC_ADM ||
          common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM
        )
          adminState.value = true;
      }
      userDetail.value = common.getItem(KEYS.LU);

      if (common.getItem(KEYS.MR)) common.removeItem(KEYS.MR);
      if (common.getItem(KEYS.SR)) common.removeItem(KEYS.SR);
    });

    return {
      adminState,
      userKey,
      userDetail,
    };
  },
});
</script>

<template>
  <my-info-component
    v-if="userKey && userDetail && !adminState"
    :userKey="userKey"
    :user-data="userDetail"
  ></my-info-component>
  <admin-main-component v-if="adminState"> </admin-main-component>
</template>
