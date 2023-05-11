<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  assignInterface,
  defaultInterface,
  scheduleInterface,
  testInterface,
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
  setup() {
    const router = useRouter();
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
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
    const assignType = ref("ALL");
    const createMode = ref(false);
    const content = ref<string>("");
    const selectedDate = ref<Date>(new Date());

    const getAssignmentList = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
      };

      const result = await ApiClient(
        "/lectures/getAssignList/",
        common.makeJson(data)
      );

      assignList.value = [];
      if (result) {
        if (result.count > 0) {
          totalCnt.value = result.count;

          result.resultData.map((item: assignInterface) => {
            if (assignType.value === "ALL") {
              if (item.type === "전체") {
                assignList.value?.push(item);
              }
            } else {
              if (item.type === "개별") {
                assignList.value?.push(item);
              }
            }
          });
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

    const showUploadModal = () => {
      createMode.value = true;
      store.commit("setModalState", true);
    };

    const doInsert = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
        lectureName: lectureInfo.value?.lectureName,
        content: content.value,
        deadLine: selectedDate.value,
        type: assignType.value === "ALL" ? "전체" : "개별",
      };

      const result = await ApiClient(
        "/lectures/createAssign/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          const inputFile: HTMLInputElement = document.getElementById(
            "input-file"
          ) as HTMLInputElement;

          if (inputFile.files) {
            const fileData = ref<FormData>(new FormData());

            fileData.value.append("assignKey", result.resultData.assignKey);
            fileData.value.append("assignment", inputFile.files[0]);

            const fileResult = await FileClient(
              "/lectures/editAssignFile/",
              fileData.value
            );

            if (fileResult) {
              if (fileResult.chunbae === RESULT_KEY.EDIT) {
                window.alert("과제가 성공적으로 등록되었습니다.");
                router.go(0);
              }
            }
          } else {
            window.alert("과제가 성공적으로 등록되었습니다.");
            router.go(0);
          }
        }
      }
    };

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

        await getAssignmentList();
      }
    });

    return {
      category,
      adminState,
      selectState,
      lectureInfo,
      assignHeader,
      assignList,
      totalCnt,
      assignTypeList,
      assignType,
      createMode,
      content,
      selectedDate,
      backToSelect,
      selectLecture,
      changeType,
      downloadFile,
      showUploadModal,
      doInsert,
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
              :list-cnt="12"
              :total-cnt="totalCnt"
              list-type="assign"
              :row-height="44"
              @downloadFile="downloadFile"
            ></data-list-component>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      :title="createMode ? '과제 업로드' : '과제 상세 조회'"
      modal-width="1078px"
      modal-height="750px"
    >
      <template v-slot:button>
        <div v-if="createMode" class="btn">
          <div class="btn-save-active" @click="doInsert">업로드</div>
        </div>
      </template>
      <template v-slot:body>
        <div v-if="createMode" class="assign-create">
          <span class="assign-create-lecture">{{
            lectureInfo?.lectureName
          }}</span>
          <div class="assign-create-body">
            <textarea
              class="assign-create-body-content"
              v-model="content"
              placeholder="과제 내용"
            ></textarea>
            <div class="assign-create-body-file">
              <form>
                <input type="file" id="input-file" />
              </form>
            </div>
          </div>
          <div class="assign-create-deadline">
            <span>과제 마감일</span>
            <v-date-picker
              class="calendar-date"
              mode="dateTime"
              v-model="selectedDate"
              :minute-increment="5"
            />
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
