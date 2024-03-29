<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from "vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import common from "../../lib/common";
import { CONSTANT, KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import {
  adminInterface,
  analysisInterface,
  defaultInterface,
  scheduleInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import DataListComponent from "../custom/DataListComponent.vue";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useRouter } from "vue-router";
/*
@brief [강사, 관리자] [Main]학생 관리 [Sub] 분석 접근 시,
       분석 목록 및 상세를 열람할 학생을 먼저 선택한 후, 분석 목록 접근
 */
export default defineComponent({
  name: "AnalysisComponent",
  props: {
    adminState: {
      types: Boolean as PropType<boolean>,
      required: true,
    },
  },
  components: { ModalPopupComponent, DataListComponent, DropBoxComponent },
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const fileURL: string = CONSTANT.FILE_URL;
    const userKey = ref<string>("");
    const teacherDetail = ref<teacherInterface | undefined>(undefined);
    const lectureHolder = ref<string>("강의 선택");
    const lectureList = ref<defaultInterface[]>([]);
    const lectureKey = ref<string>("");
    const studentList = ref<studentInterface[] | undefined>(undefined);
    const selectStudentState = ref(false);
    const selectedStudent = ref<studentInterface | undefined>(undefined);
    const date = ref<Date>(new Date());
    const selectedDate = ref<string>("");

    const analysisHeader: defaultInterface[] = [
      { KEY: "date", VALUE: "작성 일자" },
      { KEY: "writer", VALUE: "작성자" },
      { KEY: "detail", VALUE: "상세 내용" },
    ];
    const analysisList = ref<Array<analysisInterface>>([]);
    const totalCnt = ref<number>(0);

    const modalState = ref<string | undefined>(undefined);
    const insertAnalysisDetail = ref<string>("");
    const analysisDetail = ref<analysisInterface | undefined>(undefined);

    const editState = ref(false);

    const goBack = () => {
      common.removeItem(KEYS.SS);
      router.go(0);
    };

    const getLectureList = async () => {
      let data = {
        userKey: props.adminState ? "" : userKey.value,
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

    const selectLecture = async (lecture: defaultInterface) => {
      lectureKey.value = lecture.KEY;
      await getStudentList();
    };

    const refreshPage = () => {
      router.go(0);
    };

    const getStudentList = async () => {
      let data = {
        userKey: lectureKey.value ? "" : userKey.value,
        search: "",
        lectureKey: lectureKey.value,
        parentKey:
          common.getItem(KEYS.UK).userKey === USER_KEY.PAR
            ? common.getItem(KEYS.LU).parentKey
            : "",
      };

      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result) {
        studentList.value = undefined;
        if (result.count > 0) {
          studentList.value = result.resultData as studentInterface[];
        }
      }
    };

    const getAnalysisList = async () => {
      let data = {
        userKey: selectedStudent.value?.studentKey,
        date: selectedDate.value,
      };

      const result = await ApiClient(
        "/info/getAnalysisList/",
        common.makeJson(data)
      );

      if (result) {
        analysisList.value = [];

        if (result.count > 0) {
          analysisList.value = result.resultData as analysisInterface[];
          totalCnt.value = analysisList.value?.length as number;
        }
      }
    };

    const selectStudent = async (student: studentInterface) => {
      selectedStudent.value = student;
      common.setItem(KEYS.SS, common.makeJson(selectedStudent.value));
      selectedDate.value =
        date.value?.toLocaleDateString().split("/")[2] +
        "-" +
        date.value?.toLocaleDateString().split("/")[1] +
        "-" +
        date.value?.toLocaleDateString().split("/")[0];

      await getAnalysisList();
      selectStudentState.value = true;
    };

    const openModal = (mode: string) => {
      modalState.value = mode;
      store.commit("setModalState", true);
    };

    const insertAnalysis = async () => {
      if (!insertAnalysisDetail.value) {
        window.alert("분석 내용을 입력해 주세요.");
        return false;
      }

      let data = {
        studentKey: selectedStudent.value?.studentKey,
        studentName: selectedStudent.value?.name,
        writerKey: userKey.value,
        writerName: props.adminState ? "관리자" : teacherDetail.value?.name,
        content: insertAnalysisDetail.value,
      };

      const result = await ApiClient(
        "/info/createAnalysis/",
        common.makeJson(data)
      );

      if (result.chunbae === RESULT_KEY.CREATE) {
        window.alert("분석 내용을 성공적으로 입력했습니다.");
        router.go(0);
      }
    };

    const showAnalysisDetail = (analysis: analysisInterface) => {
      analysisDetail.value = analysis;
      openModal("view");
    };

    const changeEditState = () => {
      editState.value = true;
    };

    const editAnalysis = async () => {
      if (analysisDetail.value?.content === insertAnalysisDetail.value) {
        if (
          window.confirm("변경된 내용이 없습니다. 수정을 취소하시겠습니까?")
        ) {
          return false;
        }
      } else {
        let data = {
          analysisKey: analysisDetail.value?.analysisKey,
          content: insertAnalysisDetail.value,
        };

        const result = await ApiClient(
          "/info/editAnalysis/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            window.alert("성공적으로 수정했습니다.");
            router.go(0);
          } else {
            window.alert("수정을 실패했습니다.");
            return false;
          }
        }
      }
    };

    const deleteAnalysis = async () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        let data = {
          analysisKey: analysisDetail.value?.analysisKey,
        };

        const result = await ApiClient(
          "/info/deleteAnalysis/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.DELETE) {
            window.alert("성공적으로 삭제했습니다.");
            router.go(0);
          }
        } else {
          window.alert("삭제를 실패했습니다.");
        }
      } else {
        return false;
      }
    };

    watch(
      () => date.value,
      async () => {
        if (date.value) {
          selectedDate.value =
            date.value?.toLocaleDateString().split("/")[2] +
            "-" +
            date.value?.toLocaleDateString().split("/")[1] +
            "-" +
            date.value?.toLocaleDateString().split("/")[0];
          await getAnalysisList();
        } else {
          window.alert("날짜를 선택해 주세요.");
        }
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (!props.adminState) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
          teacherDetail.value = common.getItem(KEYS.LU) as teacherInterface;
          userKey.value = teacherDetail.value.teacherKey;
        }
      } else {
        userKey.value = (common.getItem(KEYS.LU) as adminInterface).adminKey;
      }

      if (common.getItem(KEYS.SS)) {
        selectedStudent.value = common.getItem(KEYS.SS);
        selectStudentState.value = true;

        await getAnalysisList();
      }

      if (common.getItem(KEYS.UK).userKey !== USER_KEY.PAR) {
        await getLectureList();
      }
      await getStudentList();
    });

    onUnmounted(() => {
      common.removeItem(KEYS.SS);
    });

    return {
      category,
      fileURL,
      teacherDetail,
      lectureHolder,
      lectureList,
      lectureKey,
      studentList,
      selectStudentState,
      selectedStudent,
      date,
      analysisHeader,
      analysisList,
      totalCnt,
      modalState,
      insertAnalysisDetail,
      analysisDetail,
      editState,
      goBack,
      selectLecture,
      refreshPage,
      selectStudent,
      openModal,
      insertAnalysis,
      showAnalysisDetail,
      changeEditState,
      editAnalysis,
      deleteAnalysis,
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
          <span class="refresh-btn" v-if="lectureKey" @click="refreshPage"
            >강의 다시 선택하기</span
          >
          <div
            class="analysis-component-section-body-select"
            v-if="adminState || teacherDetail"
          >
            <div class="analysis-component-section-body-select-drop">
              <drop-box-component
                :placeholder="lectureHolder"
                :select-list="lectureList"
                @selectValue="selectLecture"
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
                <img
                  v-if="item.profileImg"
                  :src="fileURL + item.profileImg"
                  alt="profile"
                />
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
          <div class="go-prev" @click="goBack">
            학생 다시 선택하기 <i class="fa-solid fa-rotate-left"></i>
          </div>
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
                :header="analysisHeader"
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
      <template v-slot:button v-if="modalState === 'view'">
        <div class="btn">
          <div
            :class="editState ? 'btn-save-active' : 'btn-save'"
            @click="editAnalysis"
          >
            저장하기
          </div>
          <div
            :class="!editState ? 'btn-edit-active' : 'btn-edit'"
            @click="changeEditState"
          >
            수정하기
          </div>
        </div>
      </template>
      <template v-slot:body v-if="modalState === 'insert'">
        <div class="analysis-insert">
          <div class="analysis-insert-header">
            <div class="analysis-insert-header-lecture">강의명</div>
            <div class="analysis-insert-header-student">
              {{ selectedStudent?.name }}
            </div>
            <div class="analysis-insert-header-date">
              {{ new Date().toDateString() }}
            </div>
            <button class="analysis-insert-header-save" @click="insertAnalysis">
              저장
            </button>
          </div>
          <div class="sap"></div>
          <textarea
            v-model="insertAnalysisDetail"
            placeholder="분석 내용을 입력해주세요."
            class="analysis-insert-body"
          ></textarea>
        </div>
      </template>

      <template v-slot:body v-else>
        <span class="del-btn" @click="deleteAnalysis">분석 내용 삭제하기</span>
        <div class="analysis-detail">
          <div class="analysis-detail-header">
            <div class="analysis-detail-header-date">
              {{ analysisDetail?.createDate.substring(0, 4) }}년
              {{ analysisDetail?.createDate.substring(5, 7) }}월
              {{ analysisDetail?.createDate.substring(8, 10) }}일
            </div>
            <div class="sap"></div>
            <div class="analysis-detail-header-lecture">강의명 어떻게 넣지</div>
            <div class="sap"></div>
            <div class="analysis-detail-header-student">
              {{ analysisDetail?.studentName }}
            </div>
          </div>
          <textarea
            v-if="editState"
            v-model="insertAnalysisDetail"
            :placeholder="analysisDetail?.content"
            class="analysis-detail-body"
          ></textarea>
          <div style="white-space: pre" class="analysis-detail-body" v-else>
            {{ analysisDetail?.content }}
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
