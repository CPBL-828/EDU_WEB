<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import {
  analysisInterface,
  defaultInterface,
  scheduleInterface,
  studentInterface,
} from "../../lib/types";
import DataListComponent from "../custom/DataListComponent.vue";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
/*
@brief [강사, 관리자] [Main]학생 관리 [Sub] 분석 접근 시,
       분석 목록 및 상세를 열람할 학생을 먼저 선택한 후, 분석 목록 접근
 */
export default defineComponent({
  name: "AnalysisComponent",
  components: { ModalPopupComponent, DataListComponent, DropBoxComponent },
  setup() {
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherKey = ref<string | undefined>(undefined);
    const placeholder = ref<string>("강의 선택");
    const lectureList = ref<defaultInterface[]>([]);
    const studentList = ref<studentInterface[] | undefined>(undefined);
    const selectStudentState = ref(false);
    const date = new Date();

    const headerList: defaultInterface[] = [
      { KEY: "date", VALUE: "작성 일자" },
      { KEY: "writer", VALUE: "작성자" },
      { KEY: "detail", VALUE: "상세 내용" },
    ];

    const modalState = ref<string | undefined>(undefined);

    const getLectureList = async () => {
      let data = { userKey: teacherKey.value, search: "" };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            lectureList.value.push({
              KEY: item.lectureKey,
              VALUE: item.lectureName,
            });
          });
        }
      }
    };

    const getStudentList = async () => {
      let data = { userKey: teacherKey.value, search: "" };

      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          studentList.value = result.resultData as studentInterface[];
        }
      }
    };

    const getAnalysisList = async () => {
      let data = { userKey: "", studentKey: "" };
    };

    const selectStudent = (s: studentInterface) => {
      selectStudentState.value = true;
    };

    const openModal = (v: string) => {
      modalState.value = v;
      store.commit("setModalState", true);
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey.value = common.getItem(KEYS.LU).teacherKey;
      }

      await getLectureList();
      await getStudentList();
    });

    const apidead: analysisInterface[] = [
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
      {
        analysisKey: "",
        studentKey: "",
        studentName: "박춘배 자냐",
        writerKey: "",
        writerName: "api 내놔",
        content: "아니 완성 직전이라면서 잠을 자러 가면 어떡함?",
        createDate: "2022-11-25",
        editDate: "",
      },
    ];
    const totalCnt: number = apidead.length;

    return {
      category,
      placeholder,
      lectureList,
      studentList,
      selectStudentState,
      date,
      headerList,
      modalState,
      selectStudent,
      openModal,
      apidead,
      totalCnt,
    };
  },
});
</script>

<template>
  <section class="analysis-component" v-if="!selectStudentState">
    <div class="analysis-component">
      <div class="analysis-component-section">
        <div class="analysis-component-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="analysis-component-section-body">
          <div class="analysis-component-section-body-select">
            <div class="analysis-component-section-body-select-drop">
              <drop-box-component
                :placeholder="placeholder"
                :select-list="lectureList"
              ></drop-box-component>
            </div>
          </div>
          <div class="analysis-component-section-body-list">
            <div class="analysis-component-section-body-list-header">
              <div class="name-label">학생명</div>
              <div class="analysis-label">분석 내용</div>
            </div>
            <div class="analysis-component-section-body-list-student">
              <div
                class="analysis-component-section-body-list-student-item"
                v-for="item in studentList"
              >
                <i class="fa-solid fa-user" v-if="!item.profileImg"></i>
                <div
                  class="analysis-component-section-body-list-student-item-name"
                >
                  {{ item.name }}
                </div>
                <div
                  class="analysis-component-section-body-list-student-item-show"
                  @click="selectStudent(item)"
                >
                  열람하기
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="analysis-content" v-if="selectStudentState">
    <div class="analysis-content">
      <div class="analysis-content-section">
        <div class="analysis-content-section-tag">분석 내용 열람하기</div>
        <div class="analysis-content-section-body">
          <div class="analysis-content-section-body-date">
            <div class="analysis-content-section-body-date-label">
              확인 원하는 일자를 선택해주세요.
            </div>
            <div class="analysis-content-section-body-date-calendar">
              <v-date-picker
                is-expended
                mode="date"
                v-model="date"
              ></v-date-picker>
            </div>
          </div>
          <div class="analysis-content-section-body-data">
            <div
              class="analysis-content-section-body-data-write"
              @click="openModal('insert')"
            >
              <i class="fa-regular fa-pen-to-square"></i>
              상세 내용 작성하기
            </div>
            <div class="analysis-content-section-body-data-list">
              <data-list-component
                list-type="analysis"
                :header="headerList"
                :data-list="apidead"
                :total-cnt="totalCnt ? totalCnt : 0"
                :row-height="39"
                :list-cnt="13"
              ></data-list-component>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      :title="modalState === 'insert' ? '분석 내용 입력' : '분석 상세 내용'"
    >
      <template v-slot:body>
        <div class="insert-section"></div>
      </template>
    </modal-popup-component>
  </section>
</template>
