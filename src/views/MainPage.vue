<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import MyInfoComponent from "../components/myInfo/MyInfoComponent.vue";
import {
  adminInterface,
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
export default defineComponent({
  name: "MainPage",
  components: { MyInfoComponent },
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
    v-if="userData !== undefined && !adminState"
    :userKey="userKey"
    :user-data="userData"
  ></my-info-component>
</template>
