<script lang="ts">
import { defineComponent, ref } from "vue";
import { USER_KEY } from "../../constant";
import { useRouter } from "vue-router";
/*
@brief 본인 권한을 선택하고 해당 유저의 로그인 창으로 넘어가는 페이지
 */
export default defineComponent({
  name: "LoginPage",
  setup() {
    const router = useRouter();
    const userType = ref([
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

    /*
    @brief 로그인 화면으로 이동
    @date 22/10/06
    @param 로그인 유저를 표시할 userType의 key 값
     */
    const goLogin = (key: string) => {
      let user: string = "";
      if (key === USER_KEY.STU) user = "student";
      else if (key === USER_KEY.PAR) user = "parent";
      else if (key === USER_KEY.TEA) user = "teacher";
      else if (key === USER_KEY.ADM) user = "admin";

      router.push("/" + user + "/login");
    };

    return {
      userType,
      goLogin,
    };
  },
});
</script>

<template>
  <section class="login-page">
    <div class="login-page">
      <div class="login-page-header">EDU 학원 관리 프로그램</div>
      <div class="login-page-select">
        <div class="login-page-select-hello">반갑습니다!</div>
        <div class="login-page-select-hello-guide">
          이용하실 서비스를 선택해주세요.
        </div>
        <div class="login-page-select-section">
          <div
            class="login-page-select-section-item"
            v-for="item in userType"
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
    </div>
  </section>
</template>
