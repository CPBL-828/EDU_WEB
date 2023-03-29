<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import {
  adminInterface,
  defaultInterface,
  suggestInterface,
} from "../lib/types";
import common from "../lib/common";
import DataListComponent from "./custom/DataListComponent.vue";
import DropBoxComponent from "./custom/DropBoxComponent.vue";
import { ApiClient } from "../axios";
import SelectButtonComponent from "./custom/SelectButtonComponent.vue";
import ModalPopupComponent from "./custom/ModalPopupComponent.vue";
import { KEYS, RESULT_KEY, USER_KEY } from "../constant";
import { useRouter } from "vue-router";
/*
@brief [학생, 학부모, 강사] [Main] 내 공간 [Sub]건의사항
       [관리자] [Main]학생 관리, 강사 관리 [Sub]건의사항
       교무 관리자는 각 유저의 건의사항 처리
       기타 관리자는 각 유저의 건의사항 열람만 가능
 */
export default defineComponent({
  name: "SuggestionManageComponent",
  props: {
    showUser: {
      type: String as PropType<string>,
      required: true,
    },
  },
  components: {
    ModalPopupComponent,
    SelectButtonComponent,
    DropBoxComponent,
    DataListComponent,
  },
  setup: function (props) {
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string>("");
    const userType = ref<string>("");
    const selectState = ref("wait");
    const selectItem = ref<Array<defaultInterface>>([
      { KEY: "ok", VALUE: "처리 완료" },
      { KEY: "wait", VALUE: "대기중" },
    ]);
    const header: defaultInterface[] = [
      { KEY: "DATE", VALUE: "건의 일자" },
      { KEY: "TYPE", VALUE: "건의 유형" },
      { KEY: "WRITEr", VALUE: "작성자명" },
    ];
    const placeholder: string = "건의 유형";
    const typeList: defaultInterface[] = [
      { KEY: "LECTURE", VALUE: "강의" },
      { KEY: "STUDENT", VALUE: "학생" },
      { KEY: "TEACHER", VALUE: "강사" },
      { KEY: "FACILITY", VALUE: "시설물" },
      { KEY: "ETC", VALUE: "기타" },
    ];
    const consultType = ref<string>("");
    const allSuggestList = ref<Array<suggestInterface> | undefined>(undefined);
    const viewSuggestList = ref<Array<suggestInterface>>([]);
    const suggestDetail = ref<suggestInterface | undefined>(undefined);
    const totalCnt = ref<number | undefined>(undefined);
    const answer = ref<string>("");

    const setSuggestList = async () => {
      let data = {
        userType: userType.value,
        search: "",
        writerType: props.showUser,
        userKey: userKey.value,
      };

      const result = await ApiClient(
        "/info/getSuggestList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          allSuggestList.value = result.resultData;

          allSuggestList.value?.map((item: suggestInterface) => {
            if (item.state === "N") {
              viewSuggestList.value.push(item);
            }
          });
        }
      }
    };

    const changeState = (s: string) => {
      selectState.value = s;

      if (allSuggestList.value) {
        viewSuggestList.value = [];

        if (s === "ok") {
          allSuggestList.value.map((item: suggestInterface) => {
            if (item.state === "Y") {
              viewSuggestList.value.push(item);
            }
          });
        } else {
          allSuggestList.value.map((item: suggestInterface) => {
            if (item.state === "N") {
              viewSuggestList.value.push(item);
            }
          });
        }

        totalCnt.value = viewSuggestList.value.length;
      }
    };

    const selectType = (t: defaultInterface) => {
      consultType.value = t.VALUE as string;
    };

    const saveSuggestDetail = (i: suggestInterface) => {
      suggestDetail.value = i;
    };

    const clickAnswer = () => {
      if (!suggestDetail.value) {
        window.alert("처리할 건의사항을 먼저 선택해주세요.");
        return false;
      }
    };

    const insertAnswer = async () => {
      if (!suggestDetail.value) {
        window.alert("처리할 건의사항을 먼저 선택해주세요.");
      } else if (!answer.value) {
        window.alert("답변을 작성해주세요.");
      }

      let data = {
        adminKey: userKey.value,
        suggestKey: suggestDetail.value?.suggestKey,
        answer: answer.value,
      };

      const result = await ApiClient(
        "/info/createSuggestReply/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          window.alert("답변을 성공적으로 작성했습니다.");
          router.go(0);
        } else {
          window.alert("실패했습니다.");
        }
      } else {
        window.alert("실패했습니다.");
      }
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.LU)) {
        userKey.value = (common.getItem(KEYS.LU) as adminInterface).adminKey;
        userType.value = common.getItem(KEYS.UK).userKey.slice(-3);
      }

      await setSuggestList();
    });

    return {
      category,
      selectState,
      selectItem,
      header,
      placeholder,
      typeList,
      viewSuggestList,
      suggestDetail,
      totalCnt,
      answer,
      changeState,
      selectType,
      saveSuggestDetail,
      clickAnswer,
      insertAnswer,
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
          <span class="suggestion-section-body-title">건의 목록</span>
          <div class="suggestion-section-body-state">
            처리 여부 :
            <div class="suggestion-section-body-state-button">
              <select-button-component
                :state-value="selectItem"
                :select-value="selectState"
                @changeState="changeState"
              />
            </div>
          </div>
          <div class="suggestion-section-body-data" v-if="viewSuggestList">
            <data-list-component
              list-type="suggest"
              :data-list="viewSuggestList"
              :header="header"
              :row-height="39"
              :total-cnt="totalCnt ? totalCnt : 0"
              :list-cnt="13"
              @saveSuggestDetail="saveSuggestDetail"
              admin-state="Y"
            ></data-list-component>
          </div>

          <div class="suggestion-section-body-write">
            <span class="suggestion-section-body-write-title">
              건의사항 답변
            </span>
            <div class="suggestion-section-body-write-date">
              {{ suggestDetail ? suggestDetail?.type : "건의 유형" }}
            </div>
            <div class="suggestion-section-body-write-date">
              {{
                suggestDetail
                  ? suggestDetail?.createDate.substring(0, 10)
                  : "건의 날짜"
              }}
            </div>
            <div
              style="word-break: break-all; word-wrap: break-word"
              class="suggestion-section-body-write-content"
            >
              {{
                suggestDetail
                  ? suggestDetail?.content
                  : "선택한 건의 내용이 표시됩니다."
              }}
            </div>
            <div
              style="word-break: break-all; word-wrap: break-word"
              class="suggestion-section-body-write-answer"
              v-if="suggestDetail?.answer"
            >
              {{ suggestDetail?.answer }}
            </div>
            <textarea
              v-else
              placeholder="답변을 입력해주세요."
              class="answer"
              v-model="answer"
              @click="clickAnswer"
            />
            <input
              v-if="!suggestDetail?.answer"
              type="button"
              class="suggestion-section-body-write-btn"
              value="처리"
              @click="insertAnswer"
            />
            <input
              v-else
              type="button"
              class="suggestion-section-body-write-btn"
              value="수정"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
