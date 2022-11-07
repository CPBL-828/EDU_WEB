<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DataListComponent from "../components/custom/DataListComponent.vue";
import { defaultInterface, noticeInterface } from "../lib/types";
import { useRoute } from "vue-router";
import common from "../lib/common";
import { ApiClient } from "../axios";

/*
@brief 공지사항을 표시하는 페이지
       전체 공지의 경우 공지 데이터의 type이 '전체'인 것만 보여주면 되고,
       공지 > 내 공지 접근 시, 현재 로그인한 user의 userKey를 getNoticeList parameter로 보내 해당 유저만 열람 가능한 공지 목록 표시
 */
export default defineComponent({
  name: "NoticePage",
  components: { DataListComponent },
  setup() {
    const route = useRoute();
    const header: defaultInterface[] = [
      { KEY: "TYPE", VALUE: "공지 유형" },
      { KEY: "TITLE", VALUE: "공지 제목" },
      { KEY: "DATE", VALUE: "작성일자" },
      { KEY: "WRITER", VALUE: "작성자" },
    ];
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const noticeList = ref<Array<noticeInterface> | undefined>(undefined);
    const search = ref<string | undefined>(undefined);

    const getNoticeList = async () => {
      //TODO getNoticeList parameter: type, readerKey, year 추가
      let data = { search: "" };
      if (search.value) {
        data = { search: search.value };
      }
      const result = await ApiClient(
        "/info/getNoticeList/",
        common.makeJson(data)
      );

      if (result.count > 0) {
        noticeList.value = result.resultData;
      }
    };

    watch(
      () => route.path,
      () => {
        category.value = common.findCategory();
        if (route.path === "/notice" || route.path === "/notice/all") {
          getNoticeList();
        } else {
          noticeList.value = undefined;
        }
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();
      await getNoticeList();
    });
    return {
      category,
      header,
      noticeList,
      search,
      getNoticeList,
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
        <div class="notice-section-body" v-if="noticeList">
          <div class="search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              v-model="search"
              placeholder="공지 제목 / 내용 검색"
              @keypress.enter="getNoticeList"
            />
          </div>
          <data-list-component
            :header="header"
            :notice-list="noticeList"
          ></data-list-component>
        </div>
        <div class="notice-section-body" v-if="!noticeList">
          <div class="no-data">불러올 데이터가 없습니다!</div>
        </div>
      </div>
    </div>
  </section>
</template>
