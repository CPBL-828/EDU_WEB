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
import PaginationComponent from "../fixed/PaginationComponent.vue";
import { viewAttendInterface } from "../lectureManage/AttendanceComponent.vue";

export default defineComponent({
  name: "DataListComponent",
  components: { PaginationComponent },
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
          | viewAttendInterface
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
    const viewNoticeList = ref<Array<noticeInterface> | undefined>(undefined);
    const viewSuggestList = ref<Array<suggestInterface> | undefined>(undefined);
    const viewConsultList = ref<Array<consultInterface> | undefined>(undefined);
    const viewAnalysisList = ref<Array<analysisInterface> | undefined>(
      undefined
    );
    const showAttendList = ref<Array<viewAttendInterface> | undefined>(
      undefined
    );
    const viewTestList = ref<Array<testInterface> | undefined>(undefined);
    const viewAssignList = ref<Array<assignInterface> | undefined>(undefined);
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const listCnt = ref<number>(0);

    // 공지사항
    const setNoticeList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          viewNoticeList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as noticeInterface[];
          totalPage.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          viewNoticeList.value = props.dataList as noticeInterface[];
          totalPage.value = 0;
        }
      }
    };

    // 건의사항
    const setSuggestList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          viewSuggestList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as suggestInterface[];
          totalPage.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          viewSuggestList.value = props.dataList as suggestInterface[];
          totalPage.value = 0;
        }
      }
    };

    // 상담
    const setConsultList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          viewConsultList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as consultInterface[];
          totalPage.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          viewConsultList.value = props.dataList as consultInterface[];
          totalPage.value = 0;
        }
      }
    };

    // 분석
    const setAnalysisList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          viewAnalysisList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as analysisInterface[];
          totalPage.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          viewAnalysisList.value = props.dataList as analysisInterface[];
          totalPage.value = 0;
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
          ) as viewAttendInterface[];
          totalPage.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          showAttendList.value = props.dataList as viewAttendInterface[];
          totalPage.value = 0;
        }
      }
    };

    // 시험 목록
    const setTestList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          viewTestList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as testInterface[];
          totalPage.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          viewTestList.value = props.dataList as testInterface[];
          totalPage.value = 0;
        }
      }
    };

    // 과제 목록
    const setAssignList = () => {
      if (props.dataList) {
        if (props.totalCnt > listCnt.value) {
          viewAssignList.value = props.dataList.slice(
            0,
            listCnt.value
          ) as assignInterface[];
          totalPage.value = Math.ceil(props.totalCnt / listCnt.value);
        } else {
          viewAssignList.value = props.dataList as assignInterface[];
          totalPage.value = 0;
        }
      }
    };

    const selectPage = (page: number) => {
      currentPage.value = page;
    };

    const changePage = (page: number) => {
      if (page === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    watch(
      () => currentPage.value,
      () => {
        if (props.listType === "notice") {
          viewNoticeList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as noticeInterface[];
        } else if (props.listType === "suggest") {
          viewSuggestList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as suggestInterface[];
        } else if (props.listType === "consult") {
          viewConsultList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as consultInterface[];
        } else if (props.listType === "analysis") {
          viewAnalysisList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as analysisInterface[];
        } else if (props.listType === "attend") {
          showAttendList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as viewAttendInterface[];
        } else if (props.listType == "test") {
          viewTestList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as testInterface[];
        } else if (props.listType == "assign") {
          viewAssignList.value = props.dataList?.slice(
            listCnt.value * currentPage.value - listCnt.value,
            listCnt.value * currentPage.value
          ) as assignInterface[];
        }
      }
    );

    watch(
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
      viewNoticeList,
      viewSuggestList,
      viewConsultList,
      viewAnalysisList,
      showAttendList,
      viewTestList,
      viewAssignList,
      totalPage,
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
            v-if="viewNoticeList"
            v-for="item in viewNoticeList"
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
            v-if="viewSuggestList"
            v-for="item in viewSuggestList"
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
            v-if="viewConsultList"
            v-for="item in viewConsultList"
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
            v-if="viewAnalysisList"
            v-for="item in viewAnalysisList"
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
            v-if="viewTestList"
            v-for="item in viewTestList"
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
              {{ item.testSheet ? "파일 다운로드" : "첨부 파일 없음" }}
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
            v-if="viewAssignList"
            v-for="item in viewAssignList"
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
              @click="$emit('downloadFile', item)"
            >
              {{ item.assignment ? "파일 다운로드" : "첨부 파일 없음" }}
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
                @click="$emit('showAssignDetail', item)"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div class="data-list-pagination">
        <pagination-component
          :total-page="totalPage"
          :current-page="currentPage"
          @selectPage="selectPage"
          @changePage="changePage"
        ></pagination-component>
      </div>
    </div>
  </section>
</template>
