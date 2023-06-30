<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { KEYS, USER_KEY } from "../../constant";
import CategoryItem from "./CategoryItem.vue";
import { categoryInterface, defaultInterface } from "../../lib/types";
import {
  ETC_MAIN,
  ETC_SUB,
  KYO_MAIN,
  KYO_SUB,
  PAR_MAIN,
  PAR_SUB,
  STU_MAIN,
  STU_SUB,
  TEA_MAIN,
  TEA_SUB,
} from "../../dummyCategory";
import { useRoute, useRouter } from "vue-router";
import common from "../../lib/common";

export default defineComponent({
  name: "SidebarComponent",
  components: { CategoryItem },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userKey = ref<string>("");
    const mainCategory = ref<categoryInterface[]>();
    const subCategory = ref<categoryInterface[]>();
    const resultSubItem = ref<defaultInterface[]>();
    const showSubState = ref(false);
    const selectSubState = ref<string | undefined>(undefined);

    const goToMain = () => {
      common.removeItem(KEYS.MR);
      common.removeItem(KEYS.SR);

      showSubState.value = false;
      selectSubState.value = undefined;

      router.push("/main");
    };

    const onClickAway = (event: Event) => {
      if (event.isTrusted) {
        showSubState.value = false;
      }
    };

    const selectMain = (mainItem: categoryInterface) => {
      common.setItem(
        KEYS.MR,
        common.makeJson({ mr: mainItem.KEY.toLowerCase() })
      );

      if (mainItem.HAS_CHILD) {
        subCategory.value?.map((item: categoryInterface) => {
          if (mainItem.KEY === item.KEY)
            resultSubItem.value = item.VALUE as defaultInterface[];
        });

        showSubState.value = true;
      } else {
        if (selectSubState.value) selectSubState.value = undefined;
        if (common.getItem(KEYS.SR)) common.removeItem(KEYS.SR);

        showSubState.value = false;

        router.push("/" + common.getItem(KEYS.MR).mr);
      }
    };

    const selectSub = (subItem: categoryInterface) => {
      if (!common.getItem(KEYS.SR)) {
        common.setItem(
          KEYS.SR,
          common.makeJson({ sr: subItem.KEY.toLowerCase() })
        );

        router.push(
          "/" + common.getItem(KEYS.MR).mr + "/" + subItem.KEY.toLowerCase()
        );
      } else {
        if (common.getItem(KEYS.SR).sr === subItem.KEY.toLowerCase()) {
          common.removeItem(KEYS.SS);
          common.removeItem(KEYS.ST);

          router.go(0);
        } else {
          common.removeItem(KEYS.SR);
          common.setItem(
            KEYS.SR,
            common.makeJson({ sr: subItem.KEY.toLowerCase() })
          );

          router.push(
            "/" + common.getItem(KEYS.MR).mr + "/" + subItem.KEY.toLowerCase()
          );
        }
      }
    };

    const doLogout = () => {
      if (window.confirm("로그아웃 하시겠습니까?")) {
        common.removeItem(KEYS.LU);
        common.removeItem(KEYS.UK);
        common.removeItem(KEYS.MR);
        common.removeItem(KEYS.SR);
        common.removeItem(KEYS.SS);
        common.removeItem(KEYS.ST);

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
      userKey.value = common.getItem(KEYS.UK).userKey;

      if (userKey.value) {
        if (userKey.value === USER_KEY.PAR) {
          mainCategory.value = PAR_MAIN;
          subCategory.value = PAR_SUB;
        } else if (userKey.value === USER_KEY.STU) {
          mainCategory.value = STU_MAIN;
          subCategory.value = STU_SUB;
        } else if (userKey.value === USER_KEY.TEA) {
          mainCategory.value = TEA_MAIN;
          subCategory.value = TEA_SUB;
        } else if (userKey.value === USER_KEY.KYO_ADM) {
          mainCategory.value = KYO_MAIN;
          subCategory.value = KYO_SUB;
        } else {
          mainCategory.value = ETC_MAIN;
          subCategory.value = ETC_SUB;
        }
      } else {
        router.push("/");
      }

      if (route.path.split("/")[2]) {
        selectSubState.value = route.path.split("/")[2].toUpperCase();
      }
    });

    return {
      mainCategory,
      resultSubItem,
      showSubState,
      selectSubState,
      goToMain,
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
      <div class="sidebar" v-if="mainCategory">
        <img src="/assets/image/logo.png" alt="logo" @click="goToMain" />
        <div class="sidebar-user"></div>
        <div class="sidebar-category">
          <category-item
            :main-category="mainCategory"
            @selectMain="selectMain"
          ></category-item>
        </div>
      </div>
      <div class="sidebar-logout" @click="doLogout">로그아웃</div>
    </section>

    <section class="sub-sidebar">
      <div class="sub-sidebar">
        <div :class="showSubState ? 'sub-sidebar-open' : 'sub-sidebar-close'">
          <div class="back">
            <i
              class="fa-solid fa-angles-left"
              @click="showSubState = false"
            ></i>
          </div>
          <div class="hi">반갑습니다!</div>
          <div class="sub-sidebar-open-category" v-if="resultSubItem">
            <div
              :class="
                selectSubState === item.KEY
                  ? 'sub-sidebar-open-category-item-active'
                  : 'sub-sidebar-open-category-item'
              "
              v-for="item in resultSubItem"
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
