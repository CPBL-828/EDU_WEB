<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
/*
@brief 페이징 처리
@props 전체 페이지 수, 현재 선택된 페이지 값
 */
export default defineComponent({
  name: "PaginationComponent",
  props: {
    page: {
      type: Number as PropType<number>,
      required: true,
    },
    currentPage: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    const startPage = ref(0);
    const endPage = ref(0);
    const viewPage = ref<Array<number>>([]);

    const setViewPage = () => {
      if (props.currentPage > 10) {
        if (props.currentPage % 10 !== 0) {
          startPage.value = Math.floor(props.currentPage / 10) * 10 + 1;
          endPage.value = startPage.value + 9;

          if (startPage.value + 9 > props.page) {
            endPage.value = props.page;
          }
        } else {
          startPage.value = props.currentPage - 9;
          endPage.value = props.currentPage;
        }
      } else {
        startPage.value = 1;
        endPage.value = props.page > 10 ? 10 : props.page;
      }

      viewPage.value = [];
      for (let i = startPage.value; i <= endPage.value; i++) {
        viewPage.value.push(i);
      }
    };

    watch(
      () => props.currentPage,
      () => {
        setViewPage();
      }
    );

    onMounted(() => {
      watch(
        () => props.page,
        () => {
          setViewPage();
        }
      );
    });

    return {
      viewPage,
    };
  },
});
</script>

<template>
  <section class="pagination">
    <div class="pagination" v-if="viewPage.length > 0">
      <div
        :class="currentPage !== 1 ? 'arrow-active' : 'arrow'"
        @click="$emit('changePage', 0)"
      >
        <i class="fa-solid fa-angle-left"></i>
      </div>
      <span
        @click="$emit('selectPage', i)"
        v-for="i in viewPage"
        :class="currentPage === i ? 'page-active' : 'page'"
        >{{ i }}</span
      >
      <div
        :class="currentPage !== page ? 'arrow-active' : 'arrow'"
        @click="$emit('changePage', 1)"
      >
        <i class="fa-solid fa-angle-right"></i>
      </div>
    </div>
  </section>
</template>
