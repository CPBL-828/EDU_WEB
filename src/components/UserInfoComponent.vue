<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import CardListComponent from "./CardListComponent.vue";
import {
  defaultInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
import { ApiClient } from "../axios";

/*
@brief 학생 및 강사 정보를 카드형 컴포넌트를 활용해 표시하기 위한 공통 페이지
 */
export default defineComponent({
  name: "UserInfoComponent",
  props: {
    viewUser: {
      types: String as PropType<string>,
      required: true,
    },
  },
  components: { CardListComponent },
  setup(props) {
    const userKey = ref<string | undefined>(undefined);
    const userData = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);
    const category = ref<Array<defaultInterface> | undefined>(undefined);

    onMounted(async () => {
      userKey.value = common.getItem(KEYS.UK).userKey;
      category.value = common.findCategory();

      let data = { search: "" };
      if (props.viewUser === USER_KEY.STU) {
        const result = await ApiClient(
          "/members/getStudentList/",
          common.makeJson(data)
        );

        if (result) {
          userData.value = result as studentInterface[];
        }
      } else {
      }
    });

    return {
      userKey,
      category,
      userData,
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
        <div class="user-info-section-body" v-if="viewUser === 'STU'">
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
        </div>
        <div class="user-info-section-body" v-if="viewUser === 'TEA'">
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
        </div>
      </div>
    </div>
  </section>
</template>
