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
import NoticePage from "../NoticePage.vue";
import AdminMainComponent from "../../components/main/AdminMainComponent.vue";
/*
@brief 각 유저가 로그인 후, 가장 처음 표시되는 메인 화면
       [강사, 학생, 학부모] 내 정보 페이지, [관리자] 학생과 강사의 건의사항 페이지
 */
export default defineComponent({
  name: "MainPage",
  components: { AdminMainComponent, NoticePage, MyInfoComponent },
  setup() {
    const adminState = ref(false);
    const userKey = ref<string | undefined>(undefined);
    const userData = ref<
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
      userData.value = common.getItem(KEYS.LU);

      if (common.getItem(KEYS.MR)) common.removeItem(KEYS.MR);
      if (common.getItem(KEYS.SR)) common.removeItem(KEYS.SR);
    });

    return {
      adminState,
      userKey,
      userData,
    };
  },
});
</script>

<template>
  <my-info-component
    v-if="userKey && userData && !adminState"
    :userKey="userKey"
    :user-data="userData"
  ></my-info-component>
  <admin-main-component v-if="adminState"> </admin-main-component>
</template>
