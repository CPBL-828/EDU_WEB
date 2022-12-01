<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  analysisInterface,
  consultInterface,
  defaultInterface,
  noticeInterface,
  suggestInterface,
} from "../../lib/types";
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
    listType: {
      type: String as PropType<string>,
      required: true,
    },
    dataList: {
      type: Array as PropType<
        Array<
          | noticeInterface
          | suggestInterface
          | consultInterface
          | analysisInterface
        >
      >,
      required: true,
    },
    totalCnt: {
      type: Number as PropType<number>,
      required: true,
    },
    listCnt: {
      type: Number as PropType<number>,
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
    const showConsultList = ref<Array<consultInterface> | undefined>(undefined);
    const showAnalysisList = ref<Array<analysisInterface> | undefined>(
      undefined
    );
    const page = ref<number>(0);
    const currentPage = ref<number>(1);
    const listCnt = ref<number>(0);

    /*
    props에 존재하는 데이터 리스트의 종류에 따라 현재 컴포넌트에서 보여줄 데이터 리스트를 set
     */
    const setNoticeList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          showNoticeList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as noticeInterface[];
          page.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showNoticeList.value = props.dataList as noticeInterface[];
          page.value = 0;
        }
      }
    };

    const setSuggestList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          showSuggestList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as suggestInterface[];
          page.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showSuggestList.value = props.dataList as suggestInterface[];
          page.value = 0;
        }
      }
    };

    const setConsultList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          showConsultList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as consultInterface[];
          page.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showConsultList.value = props.dataList as consultInterface[];
          page.value = 0;
        }
      }
    };

    const setAnalysisList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          showAnalysisList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as analysisInterface[];
          page.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showAnalysisList.value = props.dataList as analysisInterface[];
          page.value = 0;
        }

        console.log(props.dataList);
      }
    };

    const selectPage = (n: number) => {
      currentPage.value = n;
    };

    const changePage = (n: number) => {
      if (n === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    watch(
      /*
        현재 페이지가 변경되면, 페이지 값에 따라 표시할 dataList 변경
        페이징은 추후 별도의 컴포넌트로 분리해야 함
       */
      () => currentPage.value,
      () => {
        if (props.listType === "notice") {
          showNoticeList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as noticeInterface[];
        } else if (props.listType === "suggest") {
          showSuggestList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as suggestInterface[];
        } else if (props.listType === "consult") {
          showConsultList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as consultInterface[];
        } else if (props.listType === "analysis") {
          showAnalysisList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as analysisInterface[];
        }
      }
    );

    watch(
      () => props.dataList,
      () => {
        if (props.listType === "consult") {
          setConsultList();
        } else if (props.listType === "notice") {
          setNoticeList();
        } else if (props.listType === "suggest") {
          setSuggestList();
        }
      }
    );

    onMounted(() => {
      if (props.listCnt) {
        listCnt.value = props.listCnt;
      } else {
        listCnt.value = 10;
      }

      if (props.listType === "consult") {
        setConsultList();
      } else if (props.listType === "notice") {
        setNoticeList();
      } else if (props.listType === "suggest") {
        setSuggestList();
      } else if (props.listType === "analysis") {
        setAnalysisList();
      }
    });

    return {
      showNoticeList,
      showSuggestList,
      showConsultList,
      showAnalysisList,
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
            @click="$emit('showNoticeDetail', item)"
          >
            <td
              :style="
                rowHeight
                  ? 'height:' + rowHeight + 'px'
                  : 'height: 52px; width: 15%;'
              "
            >
              {{ item.type }}
            </td>
            <td
              :style="
                rowHeight
                  ? 'height:' + rowHeight + 'px'
                  : 'height: 52px; width: 40%;'
              "
            >
              {{ item.title }}
            </td>
            <td
              :style="
                rowHeight
                  ? 'height:' + rowHeight + 'px'
                  : 'height: 52px; width: 30%;'
              "
            >
              {{ item.createDate.substring(0, 4) }}/{{
                item.createDate.substring(5, 7)
              }}/{{ item.createDate.substring(8, 10) }}
            </td>
            <td
              :style="
                rowHeight
                  ? 'height:' + rowHeight + 'px'
                  : 'height: 52px; width: 15%;'
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
              {{ item.writerName }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
              class="go-detail"
              @click="$emit('showSuggestDetail', item)"
            >
              건의 사항 보러가기
            </td>
          </tr>

          <tr
            class="data=list=section-body-item"
            v-if="showConsultList"
            v-for="item in showConsultList"
            @click="$emit('showConsultDetail', item)"
          >
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.createDate.substring(0, 4) }}년
              {{ item.createDate.substring(5, 7) }}월
              {{ item.createDate.substring(8, 10) }}일
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.consultDate?.substring(11, 16) }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.consultType }}
            </td>
            <td
              :style="rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px'"
            >
              {{ item.studentName }}
            </td>
            <td
              :style="rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px'"
            >
              {{ item.targetName }}
            </td>
          </tr>

          <tr
            class="data=list=section-body-item"
            v-if="showAnalysisList"
            v-for="item in showAnalysisList"
            @click="$emit('showAnalysisDetail', item)"
          >
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.createDate.substring(0, 4) }}년
              {{ item.createDate.substring(5, 7) }}월
              {{ item.createDate.substring(8, 10) }}일
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
            >
              {{ item.writerName }}
            </td>
            <td
              :style="
                rowHeight ? 'height:' + rowHeight + 'px' : 'height: 52px;'
              "
              class="go-detail"
            >
              상세 내용 보러 가기
            </td>
          </tr>
        </tbody>
      </table>
      <div class="data-list-pagination">
        <pagination-component
          :page="page"
          :current-page="currentPage"
          @selectPage="selectPage"
          @changePage="changePage"
        ></pagination-component>
      </div>
    </div>
  </section>
</template>
