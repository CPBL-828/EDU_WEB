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
    const selectedStudent = ref<studentInterface | undefined>(undefined);
    const date = new Date();

    const headerList: defaultInterface[] = [
      { KEY: "date", VALUE: "작성 일자" },
      { KEY: "writer", VALUE: "작성자" },
      { KEY: "detail", VALUE: "상세 내용" },
    ];
    const analysisList = ref<Array<analysisInterface>>([]);
    const totalCnt = ref<number>(0);

    const modalState = ref<string | undefined>(undefined);
    const analysisInsertDetail = ref<string>("");
    const analysisDetail = ref<analysisInterface | undefined>(undefined);

    const getLectureList = async () => {
      let data = {
        userKey: teacherKey.value,
        search: "",
        roomKey: "",
        target: "",
        roomName: "",
        lectureName: "",
      };

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
      let data = { userKey: selectedStudent.value?.studentKey };

      const result = await ApiClient(
        "/info/getAnalysisList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          analysisList.value = result.resultData as analysisInterface[];
          totalCnt.value = analysisList.value?.length as number;
        }
      }
    };

    const selectStudent = async (s: studentInterface) => {
      selectedStudent.value = s;
      await getAnalysisList();
      selectStudentState.value = true;
    };

    const openModal = (v: string) => {
      modalState.value = v;
      store.commit("setModalState", true);
    };

    const showAnalysisDetail = (item: analysisInterface) => {
      analysisDetail.value = item;
      openModal("view");
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey.value = common.getItem(KEYS.LU).teacherKey;
      }

      await getLectureList();
      await getStudentList();
    });

    return {
      category,
      placeholder,
      lectureList,
      studentList,
      selectStudentState,
      date,
      headerList,
      analysisList,
      totalCnt,
      modalState,
      analysisInsertDetail,
      analysisDetail,
      selectStudent,
      openModal,
      showAnalysisDetail,
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
                :data-list="analysisList"
                :total-cnt="totalCnt ? totalCnt : 0"
                :row-height="39"
                :list-cnt="13"
                @showAnalysisDetail="showAnalysisDetail"
              ></data-list-component>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      :title="modalState === 'insert' ? '분석 내용 입력' : '분석 상세 내용'"
    >
      <template v-slot:body v-if="modalState === 'insert'">
        <div class="analysis-insert">
          <div class="analysis-insert-header">
            <div class="analysis-insert-header-lecture">강의명</div>
            <div class="analysis-insert-header-student">학생명</div>
            <div class="analysis-insert-header-date">
              {{ new Date().toDateString() }}
            </div>
            <button class="analysis-insert-header-save">저장</button>
          </div>
          <div class="sap"></div>
          <textarea
            v-model="analysisInsertDetail"
            placeholder="분석 내용을 입력해주세요."
            class="analysis-insert-body"
          ></textarea>
        </div>
      </template>

      <template v-slot:body v-if="modalState === 'view'">
        <div class="analysis-detail">
          <div class="analysis-detail-header">
            <div class="analysis-detail-header-date">
              {{ analysisDetail?.createDate }}
            </div>
            <div class="sap"></div>
            <div class="analysis-detail-header-lecture">강의명 어떻게 넣지</div>
            <div class="sap"></div>
            <div class="analysis-detail-header-student">
              {{ analysisDetail?.studentName }}
            </div>
          </div>
          <div class="analysis-detail-body">
            {{ analysisDetail?.content }}
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
