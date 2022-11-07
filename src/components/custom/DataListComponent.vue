<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  noticeInterface,
  suggestInterface,
} from "../../lib/types";

export default defineComponent({
  name: "DataListComponent",
  props: {
    header: {
      type: Array as PropType<Array<defaultInterface>>,
      required: true,
    },
    noticeList: {
      type: Array as PropType<Array<noticeInterface>>,
      required: false,
    },
    suggestList: {
      type: Array as PropType<Array<suggestInterface>>,
      required: false,
    },
    rowHeight: {
      type: Number as PropType<number>,
      required: false,
    },
  },
  setup(props) {
    const showNoticeList = ref<Array<noticeInterface> | undefined>(undefined);
    const showSuggestList = ref<Array<suggestInterface> | undefined>(undefined);
    const totalCnt = ref(0);
    const page = ref<number>(10);
    const currentPage = ref<number>(1);
    const listCnt: number = 10;

    const setDataList = () => {
      if (props.noticeList) {
        totalCnt.value = props.noticeList.length;
        if (totalCnt.value > listCnt) {
          showNoticeList.value = props.noticeList.slice(0, listCnt);
          page.value = Math.ceil(totalCnt.value / 10);
        } else {
          showNoticeList.value = props.noticeList;
          page.value = 0;
        }
      } else if (props.suggestList) {
        totalCnt.value = props.suggestList.length;
        if (totalCnt.value > listCnt) {
          showSuggestList.value = props.suggestList.slice(0, listCnt);
          page.value = Math.ceil(totalCnt.value / 10);
        } else {
          showSuggestList.value = props.suggestList;
          page.value = 0;
        }
      }
    };

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
        if (props.noticeList) {
          showNoticeList.value = props.noticeList?.slice(
            listCnt * currentPage.value - listCnt,
            listCnt * currentPage.value
          ) as [];
        } else if (props.suggestList) {
          showSuggestList.value = props.suggestList?.slice(
            listCnt * currentPage.value - listCnt,
            listCnt * currentPage.value
          ) as [];
        }
      }
    );

    // watch(
    // () => props.dataList,
    // () => {
    //   setDataList();
    // }
    // );

    onMounted(() => {
      /*
      @brief props.dataList 길이에 맞춰 페이징 설정
       */
      setDataList();
    });
    return {
      showNoticeList,
      showSuggestList,
      totalCnt,
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
          <tr
            class="data=list=section-body-item"
            v-if="showNoticeList"
            v-for="item in showNoticeList"
          >
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.type }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.title }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.createDate.substring(0, 4) }}/{{
                item.createDate.substring(5, 7)
              }}/{{ item.createDate.substring(8, 10) }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.writerKey }}
            </td>
          </tr>

          <tr
            class="data=list=section-body-item"
            v-if="showSuggestList"
            v-for="item in showSuggestList"
          >
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.createDate.substring(0, 4) }}/{{
                item.createDate.substring(5, 7)
              }}/{{ item.createDate.substring(8, 10) }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.type }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            ></td>
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
