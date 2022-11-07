<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { defaultInterface, suggestInterface } from "../../lib/types";
import common from "../../lib/common";
import DataListComponent from "../custom/DataListComponent.vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import { ApiClient } from "../../axios";

/*
@brief 학생, 학부모, 강사의 메인 카테고리 [내 공간]의 서브 카테고리 [건의사항]으로 접근하여 건의사항 열람 및 작성
       교무 관리자는 메인 카테고리 [학생 관리]와 [강사 관리]로 접근하여 각 유저의 건의사항 처리
       기타 관리자는 각 유저의 건의사항 열람만 가능
 */
export default defineComponent({
  name: "SuggestionComponent",
  components: { DropBoxComponent, DataListComponent },
  props: {
    userKey: {
      type: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const selectState = ref("ok");
    const header: defaultInterface[] = [
      { KEY: "DATE", VALUE: "건의 일자" },
      { KEY: "TYPE", VALUE: "건의 유형" },
      { KEY: "DETAIL", VALUE: "상세 사항" },
    ];
    const placeholder: string = "건의 유형";
    const typeList: defaultInterface[] = [
      { KEY: "LECTURE", VALUE: "강의" },
      { KEY: "STUDENT", VALUE: "학생" },
      { KEY: "TEACHER", VALUE: "강사" },
      { KEY: "FACILITY", VALUE: "시설물" },
      { KEY: "ETC", VALUE: "기타" },
    ];
    const width: string = "280px";
    const datetime = ref<string>(new Date().toLocaleString().slice(0, -3));
    const allSuggestList = ref<Array<suggestInterface> | undefined>(undefined);
    const viewSuggestList = ref<Array<suggestInterface>>([]);

    const changeState = (v: string) => {
      selectState.value = v;

      if (allSuggestList.value) {
        viewSuggestList.value = [];

        if (v === "ok") {
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
      }
    };

    onMounted(async () => {
      category.value = common.findCategory();

      let data = { search: "" };
      const result = await ApiClient(
        "/info/getSuggestList/",
        common.makeJson(data)
      );

      if (result) {
        allSuggestList.value = result.resultData;

        allSuggestList.value?.map((item: suggestInterface) => {
          if (item.state === "Y") {
            viewSuggestList.value.push(item);
          }
        });
      }
    });

    return {
      category,
      selectState,
      header,
      changeState,
      datetime,
      viewSuggestList,
      placeholder,
      typeList,
      width,
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
            <span
              :class="
                selectState === 'ok'
                  ? 'suggestion-section-body-state-ok-active'
                  : 'suggestion-section-body-state-ok'
              "
              @click="changeState('ok')"
              >처리 완료</span
            >
            <span
              :class="
                selectState === 'wait'
                  ? 'suggestion-section-body-state-wait-active'
                  : 'suggestion-section-body-state-wait'
              "
              @click="changeState('wait')"
              >대기중</span
            >
          </div>
          <div class="suggestion-section-body-data" v-if="viewSuggestList">
            <data-list-component
              :suggest-list="viewSuggestList"
              :header="header"
              :row-height="39"
            ></data-list-component>
          </div>
          <div class="suggestion-section-body-write">
            <span class="suggestion-section-body-write-title">
              건의사항 작성
            </span>
            <div class="suggestion-section-body-write-drop">
              <drop-box-component
                :placeholder="placeholder"
                :select-list="typeList"
                :row-width="width"
              ></drop-box-component>
            </div>
            <div class="suggestion-section-body-write-date">
              {{ datetime }}
            </div>
            <textarea
              placeholder="내용을 입력해주세요."
              class="suggestion-section-body-write-context"
            />
            <div class="suggestion-section-body-write-btn">건의하기</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
