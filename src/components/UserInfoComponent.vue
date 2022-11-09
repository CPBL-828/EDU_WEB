<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import CardListComponent from "./custom/CardListComponent.vue";
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
@props 보여주고자 하는 유저 값
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
    const total = ref<string | undefined>(undefined);
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const search = ref<string | undefined>(undefined);
    const searchData = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);

    const getUserList = async () => {
      let data = { search: "" };
      if (search.value) {
        data = { search: search.value };
      }

      if (props.viewUser === USER_KEY.STU) {
        const result = await ApiClient(
          "/members/getStudentList/",
          common.makeJson(data)
        );

        if (result) {
          if (result.count > 0) {
            userData.value = result.resultData as studentInterface[];
            total.value = result.count;
          } else {
            window.alert("검색 내용을 찾을 수 없어요.");
          }
        }
      } else {
        const result = await ApiClient(
          "/members/getTeacherList/",
          common.makeJson(data)
        );

        if (result) {
          if (result.count > 0) {
            userData.value = result.resultData as teacherInterface[];
            total.value = result.count;
          } else {
            window.alert("검색 내용을 찾을 수 없어요.");
          }
        }
      }
    };

    onMounted(async () => {
      userKey.value = common.getItem(KEYS.UK).userKey;
      category.value = common.findCategory();

      await getUserList();
    });

    return {
      userKey,
      category,
      userData,
      total,
      search,
      searchData,
      getUserList,
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
          <div class="search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              v-model="search"
              placeholder="학생명, 학교명으로 검색"
              @keypress.enter="getUserList"
            />
          </div>
          <span v-if="total" class="total">학생 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
          <span v-if="!userData" class="total"
            >등록된 학생 정보가 없습니다.</span
          >
        </div>
        <div class="user-info-section-body" v-if="viewUser === 'TEA'">
          <div class="search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              v-model="search"
              placeholder="강사명, 담당 학년, 담당 과목으로 검색"
              @keypress.enter="getUserList"
            />
          </div>
          <span v-if="total" class="total">강사 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
          <span v-if="!userData" class="total">
            등록된 강사 정보가 없습니다.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
