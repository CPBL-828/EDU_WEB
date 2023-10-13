<script lang="ts">
import { defineComponent, ref } from "vue";
import { USER_KEY } from "../../constant";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "UserSelectPage",
  setup() {
    const router = useRouter();
    const userTypeList = ref([
      {
        KEY: USER_KEY.STU,
        VALUE: "학생",
        ICON: "/assets/image/login-student-icon.png",
      },
      {
        KEY: USER_KEY.PAR,
        VALUE: "학부모",
        ICON: "/assets/image/login-parent-icon.png",
      },
      {
        KEY: USER_KEY.TEA,
        VALUE: "강사",
        ICON: "/assets/image/login-teacher-icon.png",
      },
      {
        KEY: USER_KEY.ADM,
        VALUE: "관리자",
        ICON: "/assets/image/login-admin-icon.png",
      },
    ]);

    const goLogin = (key: string) => {
      let userType: string = "";

      if (key === USER_KEY.STU) userType = "student";
      else if (key === USER_KEY.PAR) userType = "parent";
      else if (key === USER_KEY.TEA) userType = "teacher";
      else if (key === USER_KEY.ADM) userType = "admin";

      router.push("/" + userType + "/login");
    };

    return {
      userTypeList,
      goLogin,
    };
  },
});
</script>

<template>
  <section class="login-page">
    <div class="login-page">
      <div class="login-page-select">
        <div class="login-page-select-hello">반갑습니다!</div>
        <div class="login-page-select-hello-guide">
          이용하실 서비스를 선택해주세요.
        </div>
        <div class="login-page-select-section">
          <div
            class="login-page-select-section-item"
            v-for="item in userTypeList"
            @click="goLogin(item.KEY)"
          >
            <div class="login-page-select-section-item-user">
              {{ item.VALUE }}
            </div>
            <div class="login-page-select-section-item-icon">
              <img :src="item.ICON" :alt="item.VALUE" />
            </div>
          </div>
        </div>
      </div>
      <div class="login-page-footer">
        <img src="/assets/image/logo-gray.png" alt="logo" />
        <span class="label">EDU 학원 관리 프로그램</span>
      </div>
    </div>
  </section>
</template>
