<script lang="ts">
import { defineComponent, ref } from "vue";
import DataListComponent from "../components/DataListComponent.vue";
import { defaultInterface } from "../lib/types";
export default defineComponent({
  name: "InitPage",
  components: { DataListComponent },
  setup() {
    const fakeHeader: defaultInterface[] = [
      { KEY: "TYPE", VALUE: "공지 유형" },
      { KEY: "TITLE", VALUE: "공지 제목" },
      { KEY: "DATE", VALUE: "작성일자" },
      { KEY: "WRITER", VALUE: "작성자" },
    ];
    const fakeData = [
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
      {
        type: "공지 유형",
        title: "마지막 공지 제목입니다.",
        date: "2022/10/10",
        writer: "작성자",
      },
    ];
    return {
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
        <div class="notice-section-tag">tag</div>
        <div class="notice-section-body">
          <div class="search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="공지 제목 / 내용 검색" />
          </div>
          <data-list-component
            :header="fakeHeader"
            :data-list="fakeData"
          ></data-list-component>
        </div>
      </div>
    </div>
  </section>
</template>
