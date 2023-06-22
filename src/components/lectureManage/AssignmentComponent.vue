<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  assignInterface,
  assignStatusInterface,
  defaultInterface,
  scheduleInterface,
  studentInterface,
} from "../../lib/types";
import common from "../../lib/common";
import SelectListComponent from "../custom/SelectListComponent.vue";
import { ApiClient, FileClient } from "../../axios";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import DataListComponent from "../custom/DataListComponent.vue";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";
import { CONSTANT, KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "AssignmentComponent",
  components: {
    ModalPopupComponent,
    DataListComponent,
    SelectButtonComponent,
    SelectListComponent,
  },
  setup: function () {
    const router = useRouter();
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const fileURL: string = CONSTANT.FILE_URL;
    const adminState = ref(false);
    const selectState = ref(false);
    const lectureInfo = ref<scheduleInterface | undefined>(undefined);
    const assignHeader: defaultInterface[] = [
      { KEY: "CREATE", VALUE: "생성일" },
      { KEY: "DEADLINE", VALUE: "마감일" },
      { KEY: "FILE", VALUE: "과제 파일" },
    ];
    const assignList = ref<Array<assignInterface> | undefined>(undefined);
    const totalCnt = ref(0);
    const assignTypeList: defaultInterface[] = [
      { KEY: "ALL", VALUE: "전체" },
      { KEY: "PER", VALUE: "개별" },
    ];
    const assignType = ref<string>("ALL");
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const createMode = ref(false);
    const firstPage = ref(true);
    const createAssignType = ref("ALL");
    const content = ref<string>("");
    const calendarState = ref(false);
    const selectedDate = ref<Date | undefined>(undefined);
    const selectedStudents = ref<Array<string>>([]);
    const selectedStudentData = ref<
      Array<{ assignKey: string; studentKey: string }>
    >([]);
    const assignDetail = ref<assignInterface | undefined>(undefined);
    const assignStatus = ref<Array<assignStatusInterface> | undefined>(
      undefined
    );
    const studentKey = ref<string>("");

    const getAssignmentList = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
        type: assignType.value,
        studentKey: assignType.value === "ALL" ? "" : studentKey.value,
      };

      const result = await ApiClient(
        "/lectures/getAssignList/",
        common.makeJson(data)
      );

      assignList.value = [];
      if (result) {
        if (result.count > 0) {
          assignList.value = result.resultData as assignInterface[];

          totalCnt.value = assignList.value?.length;
        }
      }
    };

    const backToSelect = () => {
      lectureInfo.value = undefined;
      common.removeItem(KEYS.SS);
      selectState.value = false;
    };

    const selectLecture = async (i: scheduleInterface) => {
      lectureInfo.value = i;
      common.setItem(KEYS.SS, common.makeJson(lectureInfo.value));

      await getAssignmentList();
      selectState.value = true;
    };

    const changeType = async (t: string) => {
      assignType.value = t;
      await getAssignmentList();
    };

    const downloadFile = async (a: assignInterface) => {
      if (a.assignment) {
        if (window.confirm("첨부파일을 다운로드 하시겠습니까?")) {
          const fileUrl = CONSTANT.FILE_URL + a.assignment;
          const response = await fetch(fileUrl);
          if (response.ok) {
            const blob = await response.blob();
            const filename = `${lectureInfo.value?.lectureName}_${a.type} 과제`;
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", filename);
            link.click();
            URL.revokeObjectURL(link.href);
          } else {
            window.alert("파일 다운로드에 실패하였습니다.");
            return false;
          }
        } else {
          return false;
        }
      } else {
        window.alert("저장되어 있는 파일이 없습니다.");
        return false;
      }
    };

    const getStudentList = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
      };

      const result = await ApiClient(
        "/lectures/getLectureStatusList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          studentList.value = result.resultData as studentInterface[];
        }
      }
    };

    const showUploadModal = async () => {
      createMode.value = true;
      await getStudentList();
      store.commit("setModalState", true);
    };

    const selectType = (t: string) => {
      createAssignType.value = t;
    };

    const showCalendar = () => {
      calendarState.value = !calendarState.value;
    };

    const handleCheckboxChange = () => {
      selectedStudents.value = selectedStudents.value?.filter(Boolean);
    };

    const insertAssignFile = async (k: string) => {
      const inputFile: HTMLInputElement = document.getElementById(
        "input-file"
      ) as HTMLInputElement;

      if (inputFile.files!.length > 0) {
        const fileData = ref<FormData>(new FormData());

        fileData.value.append("assignKey", k);
        fileData.value.append("assignment", inputFile.files![0]);

        const fileResult = await FileClient(
          "/lectures/editAssignFile/",
          fileData.value
        );

        if (fileResult) {
          if (fileResult.chunbae === RESULT_KEY.EDIT) {
            window.alert("과제가 성공적으로 등록되었습니다.");
          }
        }
      } else {
        window.alert("과제가 성공적으로 등록되었습니다.");
      }
    };

    const doInsert = async () => {
      if (!content.value) {
        window.alert("과제 내용을 작성해 주세요.");
        return false;
      } else if (!selectedDate.value) {
        window.alert("과제 마감 일자를 선택해 주세요.");
        return false;
      }

      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
        lectureName: lectureInfo.value?.lectureName,
        content: content.value,
        deadLine: selectedDate.value ? selectedDate.value : new Date(),
        type: createAssignType.value === "ALL" ? "전체" : "개별",
      };

      const result = await ApiClient(
        "/lectures/createAssign/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          if (createAssignType.value === "ALL") {
            await insertAssignFile(result.resultData.assignKey);
            router.go(0);
          } else {
            selectedStudents.value?.map((s: string) => {
              selectedStudentData.value.push({
                assignKey: (result.resultData as assignInterface).assignKey,
                studentKey: s,
              });
            });

            const statusResult = await ApiClient(
              "/lectures/createAssignStatus/",
              common.makeJson(selectedStudentData.value)
            );

            if (statusResult) {
              if (statusResult.chunbae === RESULT_KEY.CREATE) {
                window.alert("학생을 성공적으로 배정했습니다.");
                await insertAssignFile(result.resultData.assignKey);
                router.go(0);
              } else {
                window.alert("학생 배정을 실패했습니다.");
                return false;
              }
            } else {
              window.alert("학생 배정을 실패했습니다.");
              return false;
            }
          }
        }
      }
    };

    const showAssignDetail = async (a: assignInterface) => {
      createMode.value = false;
      assignDetail.value = a;
      await getAssignStatusList();
      store.commit("setModalState", true);
    };

    const changePage = () => {
      firstPage.value = !firstPage.value;
    };

    const getAssignStatusList = async () => {
      let data = {
        assignKey: assignDetail.value?.assignKey,
      };

      const result = await ApiClient(
        "/lectures/getAssignStatusList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          assignStatus.value = result.resultData as assignStatusInterface[];
        }
      }
    };

    const removeAssign = async () => {
      if (window.confirm("해당 과제를 삭제하시겠습니까?")) {
        let data = {
          assignKey: assignDetail.value?.assignKey,
        };

        const result = await ApiClient(
          "/lectures/deleteAssign/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.DELETE) {
            window.alert("과제를 성공적으로 삭제했습니다.");
            router.go(0);
          } else {
            window.alert("과제를 삭제하지 못했습니다.\n다시 시도해 주세요.");
            return false;
          }
        } else {
          window.alert("과제를 삭제하지 못했습니다.\n다시 시도해 주세요.");
          return false;
        }
      } else {
        return false;
      }
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (
        common.getItem(KEYS.UK).userKey === USER_KEY.ETC_ADM ||
        common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM
      ) {
        adminState.value = true;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.STU) {
        studentKey.value = common.getItem(KEYS.LU).studentKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.PAR) {
        const child = await common.setChildren(
          common.getItem(KEYS.LU).parentKey
        );

        if (child) {
          studentKey.value = child.studentKey;
        }
      }

      if (common.getItem(KEYS.SS)) {
        lectureInfo.value = common.getItem(KEYS.SS);
        selectState.value = true;

        await getAssignmentList();
      }
    });

    return {
      category,
      fileURL,
      adminState,
      selectState,
      lectureInfo,
      assignHeader,
      assignList,
      assignStatus,
      totalCnt,
      assignTypeList,
      assignType,
      studentList,
      createMode,
      firstPage,
      createAssignType,
      content,
      calendarState,
      selectedDate,
      selectedStudents,
      assignDetail,
      backToSelect,
      selectLecture,
      changeType,
      downloadFile,
      showUploadModal,
      selectType,
      showCalendar,
      handleCheckboxChange,
      doInsert,
      showAssignDetail,
      changePage,
      removeAssign,
    };
  },
});
</script>

<template>
  <section class="assignment">
    <div class="assignment-section">
      <div class="assignment-section-tag">
        {{
          category
            ? category[1]["VALUE"]
              ? category[1]["VALUE"]
              : category[0]["VALUE"]
            : ""
        }}
      </div>
      <div class="assignment-section-body">
        <div class="assignment-section-body-lecture" v-if="!selectState">
          <select-list-component
            list-type="LECTURE"
            @selectLecture="selectLecture"
          ></select-list-component>
        </div>
        <div class="assignment-section-body-content" v-else>
          <span class="back-btn" @click="backToSelect">강의 다시 선택하기</span>
          <div class="assignment-section-body-content-title">
            <span class="lecture-name">{{ lectureInfo?.lectureName }}</span>
            <span class="subject-name">{{ lectureInfo?.subject }}</span>
            <div class="assignment-section-body-content-title-btn">
              <div class="assignment-section-body-content-title-btn-type">
                <select-button-component
                  :state-value="assignTypeList"
                  :select-value="assignType"
                  @changeState="changeType"
                ></select-button-component>
              </div>
              <input
                v-if="!adminState"
                type="button"
                value="과제 업로드"
                class="assignment-section-body-content-title-btn-upload"
                @click="showUploadModal"
              />
            </div>
          </div>
          <div class="assignment-section-body-content-list">
            <data-list-component
              :header="assignHeader"
              :data-list="assignList ? assignList : []"
              admin-state="N"
              :list-cnt="10"
              :total-cnt="totalCnt ? totalCnt : 0"
              list-type="assign"
              :row-height="44"
              @downloadFile="downloadFile"
              @showAssignDetail="showAssignDetail"
            ></data-list-component>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      :title="createMode ? '과제 업로드' : '과제 열람하기'"
      modal-width="1078px"
      modal-height="750px"
    >
      <template v-slot:button>
        <div v-if="createMode" class="btn">
          <div class="btn-edit-active" @click="doInsert">업로드</div>
        </div>
        <div v-else class="btn">
          <div
            :class="firstPage ? 'btn-save-active' : 'btn-save'"
            @click="changePage"
          >
            제출 현황 보기
          </div>
          <div
            :class="!firstPage ? 'btn-save-active' : 'btn-save'"
            @click="changePage"
          >
            뒤로 가기
          </div>
        </div>
      </template>
      <template v-slot:body>
        <span class="remove-btn" @click="removeAssign" v-if="adminState"
          >강의 삭제하기</span
        >
        <div v-if="createMode" class="assign-create">
          <div class="assign-create-header">
            <div class="assign-create-header-lecture">
              {{ lectureInfo?.lectureName }}
            </div>
            <div class="assign-create-header-select">
              <select-button-component
                :state-value="assignTypeList"
                :select-value="createAssignType"
                @changeState="selectType"
              ></select-button-component>
            </div>
            <div class="assign-create-header-deadline" @click="showCalendar">
              {{
                selectedDate
                  ? selectedDate.toLocaleString().substring(0, 17)
                  : "마감 일자"
              }}
              <i class="fa-solid fa-chevron-down"></i>
            </div>
            <v-date-picker
              class="calendar-date"
              mode="dateTime"
              v-model="selectedDate"
              :minute-increment="5"
              v-if="calendarState"
            />
          </div>
          <div class="sap"></div>
          <div class="assign-create-body">
            <textarea
              :style="{
                width: createAssignType === 'ALL' ? '916px' : '700px',
              }"
              class="assign-create-body-content"
              v-model="content"
              placeholder="과제 내용을 작성해 주세요"
            >
            </textarea>
            <div
              class="assign-create-body-stu"
              v-if="createAssignType === 'PER'"
            >
              <p v-for="item in studentList" :key="item.studentKey">
                <label
                  ><input
                    id="student-item"
                    type="checkbox"
                    name="nb[]"
                    :value="item.studentKey"
                    v-model="selectedStudents"
                    @change="handleCheckboxChange"
                  />
                  <img :src="fileURL + item.profileImg" alt="profile user" />
                  {{ item.name }} 학생</label
                >
              </p>
            </div>
          </div>
          <form>
            <input type="file" id="input-file" />
          </form>
        </div>

        <div v-else class="assign-detail">
          <div v-if="!createMode && firstPage" class="assign-detail-first">
            <div class="assign-detail-first-header">
              <div class="assign-detail-first-header-lecture">
                {{ lectureInfo?.lectureName }}
              </div>
              <div class="sap"></div>
              <div class="assign-detail-first-header-type">
                과제 유형 : {{ assignDetail?.type }}
              </div>
              <div class="sap"></div>
              <div class="assign-detail-first-header-deadline">
                마감일 : {{ assignDetail?.deadLine.split("T")[0] }}
              </div>
            </div>
            <div class="assign-detail-first-content">
              {{ assignDetail?.content }}
            </div>
          </div>
          <div v-else-if="!createMode && !firstPage" class="assign-detail-list">
            <table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>제출 여부</th>
                  <th>비고</th>
                  <th>점수</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in assignStatus">
                  <td>{{ item.studentName }}</td>
                  <td>{{ item.assignState === "Y" ? "제출" : "미제출" }}</td>
                  <td>{{ item.assignNote ? item.assignNote : "내용 없음" }}</td>
                  <td>{{ item.assignScore }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
