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

/*
@brief
각 유저가 로그인 후, 가장 처음 표시되는 메인 화면
학생, 학부모, 강사는 내 정보 페이지, 관리자는 공지 관리 페이지가 표시
 */
export default defineComponent({
  name: "MainPage",
  components: { NoticePage, MyInfoComponent },
  setup() {
    const adminState = ref(false);
    const userKey = ref<string | undefined>(undefined);
    const userData = ref<
      parentInterface | studentInterface | teacherInterface | undefined
    >(undefined);

    onMounted(() => {
      if (common.getItem(KEYS.UK)) {
        userKey.value = common.getItem(KEYS.UK).userKey;
        if (common.getItem(KEYS.UK).userKey === USER_KEY.ADM)
          adminState.value = true;
      }
      userData.value = common.getItem(KEYS.LU);
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
    v-if="userKey !== undefined && userData !== undefined && !adminState"
    :userKey="userKey"
    :user-data="userData"
  ></my-info-component>
</template>
