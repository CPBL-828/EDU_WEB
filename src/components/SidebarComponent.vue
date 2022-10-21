<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { KEYS, USER_KEY } from "../constant";
import CategoryItem from "./CategoryItem.vue";
import {
  adminInterface,
  categoryInterface,
  defaultInterface,
  teacherInterface,
} from "../lib/types";
import { KYO_MAIN, KYO_SUB, TEA_MAIN, TEA_SUB } from "../dummyCategory";
import { useRouter } from "vue-router";
import common from "../lib/common";
export default defineComponent({
  name: "SidebarComponent",
  components: { CategoryItem },
  setup() {
    const router = useRouter();
    const userData = ref<teacherInterface | adminInterface>();
    const userKey = ref({ userKey: "" });
    const mainItem = ref<categoryInterface[]>();
    const subItem = ref<categoryInterface[]>();
    const resultItem = ref<defaultInterface[]>();
    const subState = ref(false);

    const onClickAway = (event: Event) => {
      if (event.isTrusted) {
        subState.value = false;
      }
    };

    const selectMain = (main: categoryInterface) => {
      if (main.HAS_CHILD) {
        subItem.value?.map((item: categoryInterface) => {
          if (main.KEY === item.KEY)
            resultItem.value = item.VALUE as defaultInterface[];
        });
        subState.value = true;
      } else {
        subState.value = false;
        console.log(main.VALUE);
      }
    };

    const selectSub = (sub: categoryInterface) => {
      console.log(sub.KEY);
      router.push();
    };

    const doLogout = () => {
      common.removeItem(KEYS.LU);
      router.push("/");
    };

    onMounted(() => {
      //TODO userData localStorage에서 받아오기
      userData.value = common.getItem(KEYS.LU);
      userKey.value = common.getItem(KEYS.UK);

      if (userKey.value.userKey === USER_KEY.TEA) {
        mainItem.value = TEA_MAIN;
        subItem.value = TEA_SUB;
      } else if (userKey.value.userKey === USER_KEY.ADM) {
        mainItem.value = KYO_MAIN;
        subItem.value = KYO_SUB;
      }
    });

    watch(
      () => subState.value,
      () => {
        console.log(subState.value);
      }
    );

    return {
      mainItem,
      resultItem,
      subState,
      onClickAway,
      selectMain,
      selectSub,
      doLogout,
    };
  },
});
</script>

<template>
  <div class="away" v-click-away="onClickAway">
    <section class="sidebar">
      <div class="sidebar" v-if="mainItem">
        <img src="/public/assets/image/logo.png" alt="logo" />
        <div class="sidebar-user"></div>
        <div class="sidebar-category">
          <category-item
            :main-category="mainItem"
            @selectMain="selectMain"
          ></category-item>
        </div>
      </div>
      <div class="sidebar-logout" @click="doLogout">로그아웃</div>
    </section>

    <section class="sub-sidebar">
      <div class="sub-sidebar">
        <div :class="subState ? 'sub-sidebar-open' : 'sub-sidebar-close'">
          <div class="back">
            <i class="fa-solid fa-angles-left" @click="subState = false"></i>
          </div>
          <div class="hi">반갑습니다!</div>
          <div class="sub-sidebar-open-category" v-if="resultItem">
            <div
              class="sub-sidebar-open-category-item"
              v-for="item in resultItem"
              @click="selectSub(item)"
            >
              {{ item.VALUE }}
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
