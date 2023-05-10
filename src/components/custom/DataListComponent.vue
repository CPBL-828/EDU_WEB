<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  analysisInterface,
  assignInterface,
  consultInterface,
  defaultInterface,
  noticeInterface,
  suggestInterface,
  testInterface,
} from "../../lib/types";
import ModalPopupComponent from "./ModalPopupComponent.vue";
import PaginationComponent from "../fixed/PaginationComponent.vue";
import { showAttendInterface } from "../lectureManage/AttendanceComponent.vue";
import AssignmentComponent from "../lectureManage/AssignmentComponent.vue";
/*
@brief 글 리스트 형태의 데이터를 표현하기 위한 컴포넌트
 */
export default defineComponent({
  name: "DataListComponent",
  components: { PaginationComponent, ModalPopupComponent },
  props: {
    adminState: {
      type: String as PropType<string>,
      required: false,
    },
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
          | showAttendInterface
          | testInterface
          | assignInterface
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
    const showAttendList = ref<Array<showAttendInterface> | undefined>(
      undefined
    );
    const showTestList = ref<Array<testInterface> | undefined>(undefined);
    const showAssignList = ref<Array<assignInterface> | undefined>(undefined);
    const page = ref<number>(0);
    const currentPage = ref<number>(1);
    const listCnt = ref<number>(0);

    /*
    props에 존재하는 데이터 리스트의 종류에 따라 현재 컴포넌트에서 보여줄 데이터 리스트를 set
     */
    // 공지사항
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

    // 건의사항
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

    // 상담
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

    // 분석
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
      }
    };

    // 출석 현황
    const setAttendList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          showAttendList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as showAttendInterface[];
          page.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showAttendList.value = props.dataList as showAttendInterface[];
          page.value = 0;
        }
      }
    };

    // 시험 목록
    const setTestList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          showTestList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as testInterface[];
          page.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showTestList.value = props.dataList as testInterface[];
          page.value = 0;
        }
      }
    };

    // 과제 목록
    const setAssignList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          showAssignList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as assignInterface[];
          page.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showAssignList.value = props.dataList as assignInterface[];
          page.value = 0;
        }
      }
    };

    const selectPage = (p: number) => {
      currentPage.value = p;
    };

    const changePage = (p: number) => {
      if (p === 1) currentPage.value = currentPage.value + 1;
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
        } else if (props.listType === "attend") {
          showAttendList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as showAttendInterface[];
        } else if (props.listType == "test") {
          showTestList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as testInterface[];
        } else if (props.listType == "assign") {
          showAssignList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as assignInterface[];
        }
      }
    );

    watch(
      /*
        검색, 필터링 등으로 props의 dataList가 바뀌면 setXXXList() 재호출
         */
      () => props.dataList,
      async () => {
        if (props.listType === "consult") {
          await setConsultList();
        } else if (props.listType === "notice") {
          await setNoticeList();
        } else if (props.listType === "suggest") {
          await setSuggestList();
        } else if (props.listType === "analysis") {
          await setAnalysisList();
        } else if (props.listType === "attend") {
          await setAttendList();
        } else if (props.listType === "test") {
          await setTestList();
        } else if (props.listType === "assign") {
          await setAssignList();
        }
      }
    );

    onMounted(async () => {
      if (props.listCnt) {
        listCnt.value = props.listCnt;
      } else {
        listCnt.value = 10;
      }

      if (props.listType === "consult") {
        await setConsultList();
      } else if (props.listType === "notice") {
        await setNoticeList();
      } else if (props.listType === "suggest") {
        await setSuggestList();
      } else if (props.listType === "analysis") {
        await setAnalysisList();
      } else if (props.listType === "attend") {
        await setAttendList();
      } else if (props.listType === "test") {
        await setTestList();
      } else if (props.listType === "assign") {
        await setAssignList();
      }
    });

    return {
      showNoticeList,
      showSuggestList,
      showConsultList,
      showAnalysisList,
      showAttendList,
      showTestList,
      showAssignList,
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
          <!--        공지 -->
          <tr
            class="data=list=section-body-item"
            v-if="showNoticeList"
            v-for="item in showNoticeList"
            @click="$emit('showNoticeDetail', item)"
          >
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '15%',
              }"
            >
              {{ item.type }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '40%',
              }"
            >
              {{ item.title }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '30%',
              }"
            >
              {{ item.createDate.substring(0, 4) }}/{{
                item.createDate.substring(5, 7)
              }}/{{ item.createDate.substring(8, 10) }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '15%',
              }"
            >
              관리자
            </td>
          </tr>

          <!--          건의사항 -->
          <tr
            class="data=list=section-body-item"
            v-if="showSuggestList"
            v-for="item in showSuggestList"
            @click="$emit('saveSuggestDetail', item)"
          >
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              {{ item.createDate.substring(0, 4) }}/{{
                item.createDate.substring(5, 7)
              }}/{{ item.createDate.substring(8, 10) }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{ item.type }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{ item.writerName }}
            </td>
            <td
              v-if="adminState !== 'Y'"
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '35%',
              }"
              class="go-detail"
              @click="$emit('showSuggestDetail', item)"
            >
              건의 사항 보러가기
            </td>
          </tr>

          <!--          상담 목록 -->
          <tr
            class="data=list=section-body-item"
            v-if="showConsultList"
            v-for="item in showConsultList"
            @click="$emit('showConsultDetail', item)"
          >
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '30%',
              }"
            >
              {{ item.consultDate.substring(0, 4) }}년
              {{ item.consultDate.substring(5, 7) }}월
              {{ item.consultDate.substring(8, 10) }}일
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '15%',
              }"
            >
              {{ item.consultDate?.substring(11, 16) }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{ item.consultType }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '15%',
              }"
            >
              {{ item.studentName }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{ item.targetName }}
            </td>
          </tr>

          <!--          분석 -->
          <tr
            class="data=list=section-body-item"
            v-if="showAnalysisList"
            v-for="item in showAnalysisList"
          >
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '40%',
              }"
            >
              {{ item.createDate.substring(0, 4) }}년
              {{ item.createDate.substring(5, 7) }}월
              {{ item.createDate.substring(8, 10) }}일
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{ item.writerName }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '40%',
              }"
              class="go-detail"
              @click="$emit('showAnalysisDetail', item)"
            >
              상세 내용 보러 가기
            </td>
          </tr>

          <!--          출결 현황 -->
          <tr
            class="data=list=section-body-item"
            v-if="showAttendList"
            v-for="item in showAttendList"
          >
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              {{ item.studentName }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              {{ item.totalDay }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              {{ item.attendDay }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              <input
                type="button"
                value="상세 정보"
                class="go-attend-detail"
                @click="$emit('showAttendDetail', item)"
              />
            </td>
          </tr>

          <!--        시험 목록 -->
          <tr
            class="data=list=section-body-item"
            v-if="showTestList"
            v-for="item in showTestList"
          >
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{ item.testDate.substring(0, 10) }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{ item.testType }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              {{
                new Date(new Date().toISOString().substring(0, 10)) >
                new Date(item.testDate.substring(0, 10))
                  ? "완료"
                  : "예정"
              }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
              class="file-name"
              @click="$emit('downloadSheet', item)"
            >
              시험지 파일 조회
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '20%',
              }"
            >
              <input
                type="button"
                value="상세 조회"
                class="go-attend-detail"
                @click="$emit('showTestDetail', item)"
              />
            </td>
          </tr>

          <!--          과제 목록 -->
          <tr
            class="data=list=section-body-item"
            v-if="showAssignList"
            v-for="item in showAssignList"
          >
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              {{ item.createDate.substring(0, 10) }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              {{ item.deadLine.substring(0, 10) }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
              class="file-name"
            >
              {{ item.assignment }}
            </td>
            <td
              :style="{
                height: rowHeight ? rowHeight + 'px' : '52px;',
                width: '25%',
              }"
            >
              <input
                type="button"
                value="상세 조회"
                class="go-attend-detail"
                @click="$emit('showTestDetail', item)"
              />
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
