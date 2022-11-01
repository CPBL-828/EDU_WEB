<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DataListComponent from "../components/DataListComponent.vue";
import { defaultInterface } from "../lib/types";
import { useRoute } from "vue-router";
import common from "../lib/common";
import { KEYS } from "../constant";
export default defineComponent({
  name: "NoticePage",
  components: { DataListComponent },
  setup() {
    const route = useRoute();
    const fakeHeader: defaultInterface[] = [
      { KEY: "TYPE", VALUE: "공지 유형" },
      { KEY: "TITLE", VALUE: "공지 제목" },
      { KEY: "DATE", VALUE: "작성일자" },
      { KEY: "WRITER", VALUE: "작성자" },
    ];
    const category = ref<Array<defaultInterface> | undefined>(undefined);

    const fakeData = ref<Array<object> | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        category.value = common.findCategory();
        if (route.path === "/notice/all") {
          fakeData.value = [
            {
              type: "전체 공지",
              title: "공휴일 안내",
              date: "2022-10-10",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "미납 학원생 관한 안내",
              date: "2022-10-18",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "정기 공지입니다.",
              date: "2022-10-19",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "정기 공지입니다.",
              date: "2022-09-19",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "정기 공지입니다.",
              date: "2022-08-19",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "정기 공지입니다.",
              date: "2022-07-19",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "정기 공지입니다.",
              date: "2022-06-19",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "정기 공지입니다.",
              date: "2022-05-19",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "가정의 달 안내",
              date: "2022-05-15",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "가정의 달 안내",
              date: "2022-05-15",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "5월 학원 행사 관련 공지",
              date: "2022-05-13",
              writer: "관리자",
            },
            {
              type: "전체 공지",
              title: "모든 강사진 필독",
              date: "2022-04-10",
              writer: "관리자",
            },
          ];
        } else {
          fakeData.value = undefined;
        }
      }
    );

    onMounted(() => {
      category.value = common.findCategory();

      if (route.path === "/notice" || route.path === "/notice/all") {
        fakeData.value = [
          {
            type: "전체 공지",
            title: "공휴일 안내",
            date: "2022-10-10",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "미납 학원생 관한 안내",
            date: "2022-10-18",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "정기 공지입니다.",
            date: "2022-10-19",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "정기 공지입니다.",
            date: "2022-09-19",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "정기 공지입니다.",
            date: "2022-08-19",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "정기 공지입니다.",
            date: "2022-07-19",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "정기 공지입니다.",
            date: "2022-06-19",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "정기 공지입니다.",
            date: "2022-05-19",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "가정의 달 안내",
            date: "2022-05-15",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "가정의 달 안내",
            date: "2022-05-15",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "5월 학원 행사 관련 공지",
            date: "2022-05-13",
            writer: "관리자",
          },
          {
            type: "전체 공지",
            title: "모든 강사진 필독",
            date: "2022-04-10",
            writer: "관리자",
          },
        ];
      }

      console.log(fakeData.value);
    });
    return {
      category,
      fakeHeader,
      fakeData,
    };
  },
});
</script>

<template>
  <section class="notice">
    <div class="notice">
      <div class="notice-section">
        <div class="notice-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="notice-section-body" v-if="fakeData">
          <div class="search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="공지 제목 / 내용 검색" />
          </div>
          <data-list-component
            :header="fakeHeader"
            :data-list="fakeData"
          ></data-list-component>
        </div>
        <div class="notice-section-body" v-if="!fakeData">
          <div class="no-data">불러올 데이터가 없습니다!</div>
        </div>
      </div>
    </div>
  </section>
</template>
