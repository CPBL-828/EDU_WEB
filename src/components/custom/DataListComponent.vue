<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  noticeInterface,
  suggestInterface,
} from "../../lib/types";
import { useStore } from "vuex";
import ModalPopupComponent from "./ModalPopupComponent.vue";
import PaginationComponent from "../fixed/PaginationComponent.vue";
/*
@brief 글 리스트 형태의 데이터를 표현하기 위한 컴포넌트
@props 리스트 헤더(항목) 값, 공지 데이터 리스트, 건의 데이터 리스트, 행 높이
 */
export default defineComponent({
  name: "DataListComponent",
  components: { PaginationComponent, ModalPopupComponent },
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
    const store = useStore();
    const showNoticeList = ref<Array<noticeInterface> | undefined>(undefined);
    const noticeInfo = ref<noticeInterface | undefined>(undefined);
    const showSuggestList = ref<Array<suggestInterface> | undefined>(undefined);
    const suggestInfo = ref<suggestInterface | undefined>(undefined);
    const totalCnt = ref(0);
    const page = ref<number>(0);
    const currentPage = ref<number>(1);
    const listCnt: number = 10;

    /*
    props에 존재하는 데이터 리스트의 종류에 따라 현재 컴포넌트에서 보여줄 데이터 리스트를 set
     */
    const setDataList = () => {
      if (props.noticeList) {
        totalCnt.value = props.noticeList.length;
        if (totalCnt.value > listCnt) {
          showNoticeList.value = props.noticeList.slice(0, listCnt);
          page.value = Math.ceil(totalCnt.value / listCnt);
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

    const selectPage = (n: number) => {
      currentPage.value = n;
    };

    const changePage = (n: number) => {
      if (n === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    const openModal = (v: string, i: noticeInterface | suggestInterface) => {
      store.commit("setModalState", true);

      if (v === "NOTICE") {
        noticeInfo.value = i as noticeInterface;
      } else {
        suggestInfo.value = i as suggestInterface;
      }
    };

    watch(
      /*
        현재 페이지가 변경되면, 페이지 값에 따라 표시할 dataList 변경
        페이징은 추후 별도의 컴포넌트로 분리해야 함
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

    watch(
      () => props.noticeList || props.suggestList,
      () => {
        setDataList();
      }
    );

    onMounted(() => {
      /*
      @brief props.dataList 길이에 맞춰 페이징 설정
       */
      setDataList();
    });
    return {
      showNoticeList,
      noticeInfo,
      showSuggestList,
      suggestInfo,
      totalCnt,
      page,
      currentPage,
      selectPage,
      changePage,
      openModal,
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
            @click="openModal('NOTICE', item)"
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
              관리자
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
            >
              상담 내용 조회
            </td>
          </tr>
        </tbody>
      </table>
      <pagination-component
        v-if="page !== 0"
        @changePage="changePage"
        @selectPage="selectPage"
        :page="page"
        :current-page="currentPage"
      ></pagination-component>
    </div>
  </section>

  <modal-popup-component :title="noticeInfo ? '공지 보기' : '건의 상세'">
    <template v-slot:body>
      <div v-if="noticeInfo" class="notice-info">
        <div class="notice-info-item">
          <div class="notice-info-item-type">
            <div class="label">공지 유형</div>
            <div class="context">{{ noticeInfo.type }}</div>
          </div>
          <div class="notice-info-item-title">
            <div class="label">공지 제목</div>
            <div class="context">{{ noticeInfo.title }}</div>
          </div>
          <div class="notice-info-item-date">
            <div class="label">작성 일자</div>
            <div class="context">
              {{ noticeInfo.createDate.substring(0, 4) }}-{{
                noticeInfo.createDate.substring(5, 7)
              }}-{{ noticeInfo.createDate.substring(8, 10) }}
            </div>
          </div>
        </div>
        <div class="notice-info-body">
          <div>{{ noticeInfo.content }}</div>
        </div>
      </div>
    </template>
  </modal-popup-component>
</template>
