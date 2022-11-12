<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { noticeInterface, suggestInterface } from "../../lib/types";
export default defineComponent({
  name: "PaginationComponent",
  props: {
    page: {
      type: Number as PropType<number>,
      required: false,
      default: 10,
    },
    currentPage: {
      type: Number as PropType<number>,
      required: true,
    },
  },
  setup(props) {
    onMounted(() => {});

    return {};
  },
});
</script>

<template>
  <section class="pagination">
    <div class="pagination" v-if="page !== 0">
      <div
        :class="currentPage !== 1 ? 'arrow-active' : 'arrow'"
        @click="$emit('changePage', 0)"
      >
        <i class="fa-solid fa-angle-left"></i>
      </div>
      <span
        @click="$emit('selectPage', i)"
        v-for="i in page"
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
