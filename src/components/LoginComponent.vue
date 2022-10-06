<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { ChevronLeftSquareIcon } from "@scarlab/icons-vue/outline";
import { UserCircleIcon } from "@scarlab/icons-vue/solid";
import { useRoute, useRouter } from "vue-router";
import { USER_KEY } from "../constant";
export default defineComponent({
  name: "LoginComponent",
  components: { ChevronLeftSquareIcon, UserCircleIcon },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const whoAmI = ref<string>("undefined");
    const userId = ref<string>();

    const goBack = () => {
      router.back();
    };
    const doLogin = () => {
      console.log(userId.value);
    };

    onMounted(() => {
      if (route.fullPath.substring(1, 4) === USER_KEY.STU) {
        whoAmI.value = "학생";
      } else if (route.fullPath.substring(1, 4) === USER_KEY.PAR) {
        whoAmI.value = "학부모";
      } else if (route.fullPath.substring(1, 4) === USER_KEY.TEA) {
        whoAmI.value = "강사";
      } else if (route.fullPath.substring(1, 4) === USER_KEY.ADM) {
        whoAmI.value = "관리자";
      }
    });
    return {
      whoAmI,
      userId,
      goBack,
      doLogin,
    };
  },
});
</script>

<template>
  <section class="login-input">
    <div class="login-input">
      <div class="back" @click="goBack">
        <chevron-left-square-icon /> 이전 화면으로 돌아가기
      </div>
      <div class="login-input-box">
        <div class="login-input-box-section">
          <div class="login-input-box-section-title">LOGIN</div>
          <div class="login-input-box-section-sub">
            {{ whoAmI }} ID 입력해주세요
          </div>
          <user-circle-icon class="login-input-box-section-icon" />
          <input
            type="text"
            class="login-input-box-section-input"
            placeholder="Insert ID"
            v-model="userId"
          />
          <input
            type="button"
            class="login-input-box-section-btn"
            value="로그인 하기"
            @click="doLogin"
          />
        </div>
      </div>
    </div>
  </section>
</template>
