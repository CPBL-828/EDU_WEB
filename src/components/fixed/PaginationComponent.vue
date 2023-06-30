<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";

export default defineComponent({
  name: "PaginationComponent",
  props: {
    totalPage: {
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

          if (startPage.value + 9 > props.totalPage) {
            endPage.value = props.totalPage;
          }
        } else {
          startPage.value = props.currentPage - 9;
          endPage.value = props.currentPage;
        }
      } else {
        startPage.value = 1;
        endPage.value = props.totalPage > 10 ? 10 : props.totalPage;
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
        () => props.totalPage,
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
        @click="$emit('selectPage', item)"
        v-for="item in viewPage"
        :class="currentPage === item ? 'page-active' : 'page'"
        >{{ item }}</span
      >
      <div
        :class="currentPage !== totalPage ? 'arrow-active' : 'arrow'"
        @click="$emit('changePage', 1)"
      >
        <i class="fa-solid fa-angle-right"></i>
      </div>
    </div>
  </section>
</template>
