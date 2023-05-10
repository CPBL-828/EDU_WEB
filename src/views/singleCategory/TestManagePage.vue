<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, watch } from "vue";
import {
  defaultInterface,
  scheduleInterface,
  testInterface,
  testStatusInterface,
} from "../../lib/types";
import common from "../../lib/common";
import SelectListComponent from "../../components/custom/SelectListComponent.vue";
import DataListComponent from "../../components/custom/DataListComponent.vue";
import { ApiClient, FileClient } from "../../axios";
import { useStore } from "vuex";
import ModalPopupComponent from "../../components/custom/ModalPopupComponent.vue";
import { useRouter } from "vue-router";
import DropBoxComponent from "../../components/custom/DropBoxComponent.vue";
import { CONSTANT, KEYS, RESULT_KEY, USER_KEY } from "../../constant";
export default defineComponent({
  name: "TestManagePage",
  components: {
    DropBoxComponent,
    ModalPopupComponent,
    DataListComponent,
    SelectListComponent,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const adminState = ref(false);
    const selectState = ref(false);
    const lectureInfo = ref<scheduleInterface | undefined>(undefined);
    const testHeader: defaultInterface[] = [
      { KEY: "DATE", VALUE: "시험 일자" },
      { KEY: "TYPE", VALUE: "시험 유형" },
      { KEY: "STATE", VALUE: "상태" },
      { KEY: "FILE", VALUE: "시험 파일" },
    ];
    const testList = ref<Array<testInterface> | undefined>(undefined);
    const totalCnt = ref(0);
    const testInfo = ref<testInterface | undefined>(undefined);
    const testStatus = ref<Array<testStatusInterface> | undefined>(undefined);
    const scoreMode = ref(false);
    const createMode = ref(false);
    const selectedDate = ref<Date>(new Date());
    const testType: defaultInterface[] = [
      {
        KEY: "WEEK",
        VALUE: "주 평가",
      },
      {
        KEY: "MONTH",
        VALUE: "월 평가",
      },
      {
        KEY: "MOGO",
        VALUE: "모의고사",
      },
      {
        KEY: "PAPER",
        VALUE: "쪽지 시험",
      },
      {
        KEY: "ENTER",
        VALUE: "입학 평가",
      },
    ];
    const selectedType = ref<defaultInterface | undefined>(undefined);
    const selectedFile = ref<string | undefined>(undefined);

    const getTestList = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
        type: "",
        testDate: "",
      };

      const result = await ApiClient(
        "/lectures/getTestList/",
        common.makeJson(data)
      );

      if (result) {
        totalCnt.value = 0;
        testList.value = undefined;

        if (result.count > 0) {
          totalCnt.value = result.count;
          testList.value = result.resultData;
        }
      }
    };

    const getTestStatusList = async () => {
      let data = {
        testKey: testInfo.value?.testKey,
      };

      const result = await ApiClient(
        "/lectures/getTestStatusList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          testStatus.value = result.resultData;
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

      await getTestList();
      selectState.value = true;
    };

    const showTestDetail = async (t: testInterface) => {
      testInfo.value = t;
      await getTestStatusList();
      store.commit("setModalState", true);
    };

    const downloadSheet = async (t: testInterface) => {
      if (t.testSheet) {
        if (window.confirm("첨부파일을 다운로드 하시겠습니까?")) {
          const sheetUrl = CONSTANT.FILE_URL + t.testSheet;
          const response = await fetch(sheetUrl);
          if (response.ok) {
            const blob = await response.blob();
            const filename = `${t.testDate.slice(0, 10)}_${t.testType}`;
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

    const showScore = () => {
      // scoreMode.value = true;
      store.commit("setModalState", false);
      router.push("/main");
    };

    const showCreateModal = () => {
      createMode.value = true;
      store.commit("setModalState", true);
    };

    const selectType = (t: defaultInterface) => {
      selectedType.value = t;
    };

    const insertFile = () => {
      const inputFile: HTMLInputElement = document.getElementById(
        "input-file"
      ) as HTMLInputElement;

      if (inputFile.files) {
        selectedFile.value = inputFile.files[0].name;
      }
    };

    const doInsert = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
        lectureName: lectureInfo.value?.lectureName,
        testDate: selectedDate.value,
        testType: selectedType.value?.VALUE as string,
      };

      const result = await ApiClient(
        "/lectures/createTest/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          const inputFile: HTMLInputElement = document.getElementById(
            "input-file"
          ) as HTMLInputElement;

          if (inputFile.files) {
            const fileData = ref<FormData>(new FormData());

            fileData.value.append("testKey", result.resultData.testKey);
            fileData.value.append("testSheet", inputFile.files[0]);

            const fileResult = await FileClient(
              "/lectures/editTestSheet/",
              fileData.value
            );

            if (fileResult) {
              if (fileResult.chunbae === RESULT_KEY.EDIT) {
                window.alert("시험 일정이 성공적으로 등록되었습니다.");
                router.go(0);
              }
            }
          } else {
            window.alert("시험 일정이 성공적으로 등록되었습니다.");
            router.go(0);
          }
        }
      }
    };

    watch(
      () => store.state.modalState,
      () => {
        if (!store.state.modalState) {
          scoreMode.value = false;
        }
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (
        common.getItem(KEYS.UK).userKey === USER_KEY.ETC_ADM ||
        common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM
      ) {
        adminState.value = true;
      }

      if (common.getItem(KEYS.SS)) {
        lectureInfo.value = common.getItem(KEYS.SS);
        selectState.value = true;

        await getTestList();
      }
    });

    onUnmounted(() => {
      common.removeItem(KEYS.SS);
    });

    return {
      category,
      adminState,
      selectState,
      lectureInfo,
      testHeader,
      testList,
      testInfo,
      testStatus,
      totalCnt,
      scoreMode,
      createMode,
      selectedDate,
      testType,
      selectedType,
      selectedFile,
      backToSelect,
      selectLecture,
      showTestDetail,
      downloadSheet,
      showScore,
      showCreateModal,
      selectType,
      insertFile,
      doInsert,
    };
  },
});
</script>

<template>
  <section class="test">
    <div class="test">
      <div class="test-section">
        <div class="test-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="test-section-body">
          <div class="test-section-body-lecture" v-if="!selectState">
            <select-list-component
              list-type="LECTURE"
              @selectLecture="selectLecture"
            ></select-list-component>
          </div>
          <div class="test-section-body-schedule" v-else>
            <span class="back-btn" @click="backToSelect"
              >강의 다시 선택하기</span
            >
            <div class="test-section-body-schedule-title">
              <div class="test-section-body-schedule-title-content">
                <span class="lecture-name">{{ lectureInfo?.lectureName }}</span>
                <span class="subject-name">{{ lectureInfo?.subject }}</span>
              </div>
              <input
                v-if="!adminState"
                type="button"
                class="upload-btn"
                value="시험 일정 등록하기"
                @click="showCreateModal"
              />
            </div>
            <div class="test-section-body-schedule-list">
              <data-list-component
                :header="testHeader"
                list-type="test"
                :data-list="testList ? testList : []"
                :total-cnt="totalCnt"
                @showTestDetail="showTestDetail"
                @downloadSheet="downloadSheet"
              ></data-list-component>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      :title="createMode ? '시험 일정 등록' : '시험 상세 조회'"
      modal-width="1078px"
      modal-height="750px"
    >
      <template v-slot:button>
        <div v-if="createMode" class="btn">
          <div class="btn-save-active" @click="doInsert">등록하기</div>
        </div>
      </template>
      <template v-slot:body>
        <div v-if="createMode" class="test-create">
          <div class="test-create-lecture">{{ lectureInfo?.lectureName }}</div>
          <div class="test-create-select">
            <div class="test-create-select-type">
              <drop-box-component
                placeholder="시험 유형"
                :select-list="testType"
                row-width="250px"
                @selectValue="selectType"
              />
            </div>
            <div class="test-create-select-calendar">
              <v-date-picker
                class="calendar-date"
                mode="dateTime"
                v-model="selectedDate"
                :minute-increment="5"
              />
            </div>
          </div>
          <div class="test-create-view">
            <div class="test-create-view-lecture">
              <span>{{ lectureInfo?.lectureName }}</span> 강의에
            </div>
            <div class="test-create-view-date">
              <span>
                {{ selectedDate ? selectedDate?.toLocaleString() : "" }}</span
              >
              일자로
            </div>
            <div class="test-create-view-type">
              <span>{{ selectedType ? selectedType?.VALUE : "" }}</span
              >을 등록하시겠습니까?
            </div>

            <div class="test-create-view-file">
              <span>{{
                selectedFile ? selectedFile : "관련 파일을 첨부해 주세요."
              }}</span>
              <form>
                <input type="file" id="input-file" @change="insertFile" />
              </form>
              <i class="fa-solid fa-file-arrow-up"></i>
            </div>
          </div>
        </div>
        <div v-else class="test-status">
          <div class="test-status-lecture">{{ lectureInfo?.lectureName }}</div>
          <div class="test-status-list" v-if="!scoreMode">
            <table>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>응시 여부</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in testStatus">
                  <td>{{ item.studentName }}</td>
                  <td>{{ item.state === "Y" ? "응시" : "미응시" }}</td>
                  <td>
                    <input type="button" value="성적 조회" @click="showScore" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
