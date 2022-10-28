<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { KEYS, USER_KEY } from "../../constant";
import CategoryItem from "./CategoryItem.vue";
import {
  adminInterface,
  categoryInterface,
  defaultInterface,
  teacherInterface,
} from "../../lib/types";
import { KYO_MAIN, KYO_SUB, TEA_MAIN, TEA_SUB } from "../../dummyCategory";
import { useRoute, useRouter } from "vue-router";
import common from "../../lib/common";
export default defineComponent({
  name: "SidebarComponent",
  components: { CategoryItem },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userData = ref<teacherInterface | adminInterface>();
    const userKey = ref({ userKey: "" });
    const mainItem = ref<categoryInterface[]>();
    const subItem = ref<categoryInterface[]>();
    const resultItem = ref<defaultInterface[]>();
    const subState = ref(false);
    const selectSubState = ref<string | undefined>(undefined);

    const goMain = () => {
      common.removeItem(KEYS.MR);
      common.removeItem(KEYS.SR);
      subState.value = false;
      selectSubState.value = undefined;
      router.push("/main");
    };

    const onClickAway = (event: Event) => {
      if (event.isTrusted) {
        subState.value = false;
      }
    };

    const selectMain = (main: categoryInterface) => {
      common.setItem(KEYS.MR, common.makeJson({ mr: main.KEY.toLowerCase() }));
      // router.push("/" + main.KEY.toLowerCase());

      if (main.HAS_CHILD) {
        subItem.value?.map((item: categoryInterface) => {
          if (main.KEY === item.KEY)
            resultItem.value = item.VALUE as defaultInterface[];
        });
        subState.value = true;
      } else {
        subState.value = false;
        router.push("/" + common.getItem(KEYS.MR).mr);
      }
    };

    const selectSub = (sub: categoryInterface) => {
      common.setItem(KEYS.SR, common.makeJson({ sr: sub.KEY.toLowerCase() }));

      router.push(
        "/" + common.getItem(KEYS.MR).mr + "/" + sub.KEY.toLowerCase()
      );
      setTimeout(() => {
        subState.value = false;
      }, 3000);
    };

    const doLogout = () => {
      if (window.confirm("로그아웃 하시겠습니까?")) {
        common.removeItem(KEYS.LU);
        router.push("/");
      }
    };

    watch(
      () => route.path,
      () => {
        if (route.path.split("/")[2]) {
          selectSubState.value = route.path.split("/")[2].toUpperCase();
        }
      }
    );

    onMounted(() => {
      userData.value = common.getItem(KEYS.LU);
      userKey.value = common.getItem(KEYS.UK);

      if (userKey.value.userKey === USER_KEY.TEA) {
        mainItem.value = TEA_MAIN;
        subItem.value = TEA_SUB;
      } else if (userKey.value.userKey === USER_KEY.ADM) {
        mainItem.value = KYO_MAIN;
        subItem.value = KYO_SUB;
      }

      if (route.path.split("/")[2]) {
        selectSubState.value = route.path.split("/")[2].toUpperCase();
      }
    });

    return {
      mainItem,
      resultItem,
      subState,
      selectSubState,
      goMain,
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
        <img src="/assets/image/logo.png" alt="logo" @click="goMain" />
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
              :class="
                selectSubState === item.KEY
                  ? 'sub-sidebar-open-category-item-active'
                  : 'sub-sidebar-open-category-item'
              "
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
