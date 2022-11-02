<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import CardListComponent from "./CardListComponent.vue";
import {
  defaultInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import common from "../lib/common";
import { KEYS } from "../constant";

/*
@brief 학생 및 강사 정보를 카드형 컴포넌트를 활용해 표시하기 위한 공통 페이지
 */
export default defineComponent({
  name: "UserInfoComponent",
  props: {
    userData: {
      types: Array as PropType<
        Array<studentInterface> | Array<teacherInterface>
      >,
      required: true,
    },
  },
  components: { CardListComponent },
  setup() {
    const userKey = ref<string | undefined>(undefined);
    const category = ref<Array<defaultInterface> | undefined>(undefined);

    onMounted(() => {
      userKey.value = common.getItem(KEYS.UK).userKey;
      category.value = common.findCategory();
    });

    return {
      userKey,
      category,
    };
  },
});
</script>

<template>
  <section class="user-info">
    <div class="user-info">
      <div class="user-info-section">
        <div class="user-info-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="user-info-section-body">
          <card-list-component></card-list-component>
        </div>
      </div>
    </div>
  </section>
</template>
