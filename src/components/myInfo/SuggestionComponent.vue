<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { defaultInterface } from "../../lib/types";
import common from "../../lib/common";
import DataListComponent from "../custom/DataListComponent.vue";

/*
@brief 학생, 학부모, 강사의 메인 카테고리 [내 공간]의 서브 카테고리 [건의사항]으로 접근하여 건의사항 열람 및 작성
       교무 관리자는 메인 카테고리 [학생 관리]와 [강사 관리]로 접근하여 각 유저의 건의사항 처리
       기타 관리자는 각 유저의 건의사항 열람만 가능
 */
export default defineComponent({
  name: "SuggestionComponent",
  components: { DataListComponent },
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
      { KEY: "STATE", VALUE: "교무 처리 여부" },
      { KEY: "DETAIL", VALUE: "상세 사항" },
    ];
    const aefe: defaultInterface[] = [
      { KEY: "ewf", VALUE: "wefj" },
      { KEY: "ewf", VALUE: "wefj" },
      { KEY: "ewf", VALUE: "wefj" },
    ];
    const fakeData: Array<object> = [
      {
        date: "2022-10-03",
        type: "type01",
        state: "Y",
      },
      {
        date: "2022-10-03",
        type: "type01",
        state: "Y",
      },
      {
        date: "2022-10-03",
        type: "type03",
        state: "N",
      },
      {
        date: "2022-10-03",
        type: "type01",
        state: "Y",
      },
      {
        date: "2022-10-03",
        type: "type02",
        state: "N",
      },
      {
        date: "2022-10-03",
        type: "type02",
        state: "Y",
      },
      {
        date: "2022-10-03",
        type: "type02",
        state: "N",
      },
      {
        date: "2022-10-03",
        type: "type02",
        state: "N",
      },
      {
        date: "2022-10-03",
        type: "type02",
        state: "Y",
      },
      {
        date: "2022-10-03",
        type: "type02",
        state: "Y",
      },
      {
        date: "2022-10-03",
        type: "type02",
        state: "Y",
      },
    ];

    const changeState = (v: string) => {
      selectState.value = v;
    };

    onMounted(() => {
      category.value = common.findCategory();
    });
    return {
      category,
      aefe,
      selectState,
      header,
      fakeData,
      changeState,
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
          <div class="suggestion-section-body-data">
            <data-list-component
              :data-list="fakeData"
              :header="header"
              :row-height="39"
            ></data-list-component>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
