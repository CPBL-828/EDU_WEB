<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  defaultInterface,
  studentInterface,
  suggestInterface,
  teacherInterface,
} from "../../lib/types";
import common from "../../lib/common";
import DataListComponent from "../custom/DataListComponent.vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import { ApiClient } from "../../axios";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";
import { KEYS, RESULT_KEY, USER_KEY } from "../../constant";

export default defineComponent({
  name: "SuggestionComponent",
  components: {
    ModalPopupComponent,
    SelectButtonComponent,
    DropBoxComponent,
    DataListComponent,
  },
  setup: function () {
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string>("");
    const userType = ref<string>("");
    const teacherDetail = ref<teacherInterface | undefined>(undefined);
    const studentDetail = ref<studentInterface | undefined>(undefined);
    const selectedState = ref("ok");
    const stateList = ref<Array<defaultInterface>>([
      { KEY: "ok", VALUE: "처리 완료" },
      { KEY: "wait", VALUE: "대기중" },
    ]);
    const suggestHeader: defaultInterface[] = [
      { KEY: "DATE", VALUE: "건의 일자" },
      { KEY: "TYPE", VALUE: "건의 유형" },
      { KEY: "WRITEr", VALUE: "작성자명" },
      { KEY: "DETAIL", VALUE: "상세 사항" },
    ];
    const typeHolder: string = "건의 유형";
    const typeList: defaultInterface[] = [
      { KEY: "LECTURE", VALUE: "강의" },
      { KEY: "STUDENT", VALUE: "학생" },
      { KEY: "TEACHER", VALUE: "강사" },
      { KEY: "FACILITY", VALUE: "시설물" },
      { KEY: "ETC", VALUE: "기타" },
    ];
    const type = ref<string>("");
    const content = ref<string>("");
    const dropboxWidth: string = "280px";
    const writeDate = ref<string>(new Date().toLocaleString().slice(0, -3));
    const suggestList = ref<Array<suggestInterface> | undefined>(undefined);
    const viewSuggestList = ref<Array<suggestInterface>>([]);
    const suggestDetail = ref<suggestInterface | undefined>(undefined);
    const totalCnt = ref<number | undefined>(undefined);

    const setSuggestList = async () => {
      let data = {
        userType: common.getItem(KEYS.UK).userKey,
        search: "",
        writerType: "",
        userKey: userKey.value,
      };
      const result = await ApiClient(
        "/info/getSuggestList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          suggestList.value = result.resultData;

          suggestList.value?.map((item: suggestInterface) => {
            if (item.state === "Y") {
              viewSuggestList.value.push(item);
            }
          });
        }
      }
    };

    const changeState = (state: string) => {
      selectedState.value = state;

      if (suggestList.value) {
        viewSuggestList.value = [];

        if (state === "ok") {
          suggestList.value.map((item: suggestInterface) => {
            if (item.state === "Y") {
              viewSuggestList.value.push(item);
            }
          });
        } else {
          suggestList.value.map((item: suggestInterface) => {
            if (item.state === "N") {
              viewSuggestList.value.push(item);
            }
          });
        }

        totalCnt.value = viewSuggestList.value.length;
      }
    };

    const selectType = (selectedType: defaultInterface) => {
      type.value = selectedType.VALUE as string;
    };

    const createSuggestPlan = async () => {
      if (!type.value) {
        window.alert("건의 유형을 선택해 주세요.");
        return false;
      } else if (!content.value) {
        window.alert("건의 내용을 입력해 주세요.");
        return false;
      }

      let data = {
        writerKey: userKey.value,
        writerName: teacherDetail.value
          ? teacherDetail.value.name
          : studentDetail.value?.name,
        writerType: userType.value,
        type: type.value,
        content: content.value,
      };

      const result = await ApiClient(
        "/info/createSuggestPlan/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          window.alert("건의사항을 성공적으로 작성했습니다.");
          type.value = "";
          content.value = "";
          await setSuggestList();
          changeState("wait");
        }
      }
    };

    const showSuggestDetail = (suggest: suggestInterface) => {
      suggestDetail.value = suggest;
      store.commit("setModalState", true);
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.LU)) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
          userKey.value = common.getItem(KEYS.LU).teacherKey;
          userType.value = USER_KEY.TEA;
          teacherDetail.value = common.getItem(KEYS.LU) as teacherInterface;
        } else if (common.getItem(KEYS.UK).userKey === USER_KEY.STU) {
          userKey.value = common.getItem(KEYS.LU).studentKey;
          userType.value = USER_KEY.STU;
          studentDetail.value = common.getItem(KEYS.LU) as studentInterface;
        }
      }

      await setSuggestList();
    });

    return {
      category,
      selectedState,
      stateList,
      suggestHeader,
      typeHolder,
      typeList,
      content,
      dropboxWidth,
      writeDate,
      viewSuggestList,
      suggestDetail,
      totalCnt,
      changeState,
      selectType,
      createSuggestPlan,
      showSuggestDetail,
    };
  },
});
</script>

<template>
  <section class="suggestion">
    <div class="suggestion">
      <div class="suggestion-section">
        <div class="suggestion-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="suggestion-section-body">
          <span class="suggestion-section-body-title">내 건의 목록</span>
          <div class="suggestion-section-body-state">
            교무 처리 여부 :
            <div class="suggestion-section-body-state-button">
              <select-button-component
                :select-list="stateList"
                :select-value="selectedState"
                @changeState="changeState"
              />
            </div>
          </div>
          <div class="suggestion-section-body-data" v-if="viewSuggestList">
            <data-list-component
              list-type="suggest"
              :data-list="viewSuggestList"
              :header="suggestHeader"
              :row-height="39"
              :total-cnt="totalCnt ? totalCnt : 0"
              :list-cnt="13"
              @showSuggestDetail="showSuggestDetail"
            ></data-list-component>
          </div>
          <div class="suggestion-section-body-write">
            <span class="suggestion-section-body-write-title">
              건의사항 작성
            </span>
            <div class="suggestion-section-body-write-drop">
              <drop-box-component
                :placeholder="typeHolder"
                :select-list="typeList"
                :row-width="dropboxWidth"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <div class="suggestion-section-body-write-date">
              {{ writeDate }}
            </div>
            <textarea
              placeholder="내용을 입력해주세요."
              class="context"
              v-model="content"
            />
            <div
              class="suggestion-section-body-write-btn"
              @click="createSuggestPlan"
            >
              건의하기
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component title="건의 상세">
      <template v-slot:body>
        <div class="suggest-detail">
          <div class="suggest-detail-section">
            <div class="suggest-detail-section-header">
              <div class="date">
                {{ suggestDetail?.createDate.substring(0, 4) }}년
                {{ suggestDetail?.createDate.substring(5, 7) }}월
                {{ suggestDetail?.createDate.substring(8, 10) }}일
              </div>
              <div class="sap"></div>
              <div class="type">{{ suggestDetail?.type }}</div>
              <div class="sap"></div>
              <div class="state">
                {{ suggestDetail?.state === "Y" ? "처리 완료" : "대기 중" }}
              </div>
              <div class="sap"></div>
              <div class="writer">{{ suggestDetail?.writerName }}</div>
            </div>
            <div class="top-sap"></div>
            <div class="suggest-detail-section-content">
              <div class="suggest-detail-section-content-label">건의 내용</div>
              <div class="suggest-detail-section-content-item">
                {{ suggestDetail?.content }}
              </div>
            </div>
            <div class="center-sap"></div>
            <div class="suggest-detail-section-answer">
              <div class="suggest-detail-section-answer-label">
                관리자 답변<span
                  >(답변일자:
                  {{
                    suggestDetail?.answerDate
                      ? suggestDetail?.answerDate.substring(0, 4) +
                        "년 " +
                        suggestDetail?.answerDate.substring(5, 7) +
                        "월 " +
                        suggestDetail?.answerDate.substring(8, 10) +
                        "일"
                      : ""
                  }})</span
                >
              </div>
              <div class="suggest-detail-section-answer-item">
                {{
                  suggestDetail?.answer
                    ? suggestDetail?.answer
                    : "답변을 기다리는 중입니다."
                }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
