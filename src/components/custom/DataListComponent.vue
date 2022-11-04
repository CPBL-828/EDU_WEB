<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { defaultInterface } from "../../lib/types";

export default defineComponent({
  name: "DataListComponent",
  props: {
    header: {
      type: Object as PropType<Array<defaultInterface>>,
      required: true,
    },
    dataList: {
      type: Object as PropType<Array<object> | undefined>,
      required: true,
    },
    rowHeight: {
      type: Number as PropType<number>,
      required: false,
    },
  },
  setup(props) {
    const showList = ref([{}]);
    const page = ref<number>(10);
    const currentPage = ref<number>(1);
    const listCnt: number = 10;

    const selectPage = (i: number) => {
      currentPage.value = i;
    };

    const changePage = (v: number) => {
      if (v === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    watch(
      /*
        @brief 현재 페이지가 변경되면, 페이지 값에 따라 표시할 dataList 변경
         */
      () => currentPage.value,
      () => {
        showList.value = props.dataList?.slice(
          listCnt * currentPage.value - listCnt,
          listCnt * currentPage.value
        ) as [];
      }
    );

    onMounted(() => {
      /*
      @brief props.dataList 길이에 맞춰 페이징 설정
       */
      if (props.dataList) {
        if (props.dataList.length > listCnt) {
          showList.value = props.dataList.slice(0, listCnt);
          page.value = Math.ceil(props.dataList.length / 10);
        } else {
          showList.value = props.dataList;
          page.value = 0;
        }
      }
    });
    return {
      showList,
      page,
      currentPage,
      selectPage,
      changePage,
    };
  },
});
</script>

<template>
  <section class="data-list">
    <div class="data-list">
      <table class="data-list-section">
        <thead class="data-list-section-header">
          <tr class="data-list-section-header-item">
            <th v-for="item in header">
              {{ item.VALUE }}
            </th>
          </tr>
        </thead>
        <tbody class="data-list-section-body">
          <tr class="data=list=section-body-item" v-for="item in showList">
            <td
              v-for="i in item"
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ i }}
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination" v-if="page !== 0">
        <div
          :class="currentPage !== 1 ? 'arrow-active' : 'arrow'"
          @click="changePage(0)"
        >
          <i class="fa-solid fa-angle-left"></i>
        </div>
        <span
          @click="selectPage(i)"
          v-for="i in page"
          :class="currentPage === i ? 'page-active' : 'page'"
          >{{ i }}</span
        >
        <div
          :class="currentPage !== page ? 'arrow-active' : 'arrow'"
          @click="changePage(1)"
        >
          <i class="fa-solid fa-angle-right"></i>
        </div>
      </div>
    </div>
  </section>
</template>
