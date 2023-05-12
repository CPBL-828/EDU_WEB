<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ConsultComponent from "../studentManage/ConsultComponent.vue";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import { defaultInterface, suggestInterface } from "../../lib/types";
import DataListComponent from "../custom/DataListComponent.vue";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";
/*
@brief [관리자] 로그인 성공 후 가장 초기 메인 화면
       강사와 학생의 건의 목록은 양쪽에 표시
 */
export default defineComponent({
  name: "AdminMainComponent",
  components: { ModalPopupComponent, DataListComponent, ConsultComponent },
  setup() {
    const store = useStore();
    const userKey = ref<string | undefined>(undefined);
    const header: defaultInterface[] = [
      { KEY: "DATE", VALUE: "건의 일자" },
      { KEY: "TYPE", VALUE: "건의 유형" },
      { KEY: "WRITER", VALUE: "작성자명" },
    ];
    const studentSuggest = ref<Array<suggestInterface> | undefined>(undefined);
    const stuTotal = ref<number>(0);
    const teacherSuggest = ref<Array<suggestInterface> | undefined>(undefined);
    const teaTotal = ref<number>(0);
    const suggestDetail = ref<suggestInterface | undefined>(undefined);

    const setStudentSuggest = async () => {
      let data = {
        userType: USER_KEY.ADM,
        search: "",
        writerType: USER_KEY.STU,
        userKey: userKey.value,
      };

      const result = await ApiClient(
        "/info/getSuggestList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          studentSuggest.value = result.resultData as suggestInterface[];
        }

        if (studentSuggest.value?.length) {
          stuTotal.value = studentSuggest.value?.length as number;
        }
      }
    };

    const setTeacherSuggest = async () => {
      let data = {
        userType: USER_KEY.ADM,
        search: "",
        writerType: USER_KEY.TEA,
        userKey: userKey.value,
      };

      const result = await ApiClient(
        "/info/getSuggestList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          teacherSuggest.value = result.resultData as suggestInterface[];
        }

        if (teacherSuggest.value?.length) {
          teaTotal.value = teacherSuggest.value?.length as number;
        }
      }
    };

    const showSuggestDetail = (s: suggestInterface) => {
      suggestDetail.value = s;

      store.commit("setModalState", true);
    };

    onMounted(() => {
      if (common.getItem(KEYS.LU)) {
        userKey.value = common.getItem(KEYS.LU).adminKey;
      }

      setStudentSuggest();
      setTeacherSuggest();
    });

    return {
      header,
      studentSuggest,
      stuTotal,
      teacherSuggest,
      teaTotal,
      suggestDetail,
      showSuggestDetail,
    };
  },
});
</script>

<template>
  <section class="admin-main">
    <div class="admin-main">
      <div class="admin-main-section">
        <div class="admin-main-section-left">
          <div class="admin-main-section-left-tag">학생 건의 내역</div>
          <div class="admin-main-section-left-body">
            <div class="admin-main-section-left-body-list">
              <data-list-component
                :header="header"
                list-type="suggest"
                :data-list="studentSuggest ? studentSuggest : []"
                :row-height="39"
                :total-cnt="stuTotal"
                :list-cnt="8"
                admin-state="Y"
                @saveSuggestDetail="showSuggestDetail"
              >
              </data-list-component>
            </div>
          </div>
        </div>
        <div class="admin-main-section-right">
          <div class="admin-main-section-right-tag">강사 건의 내역</div>
          <div class="admin-main-section-right-body">
            <div class="admin-main-section-right-body-list">
              <data-list-component
                :header="header"
                list-type="suggest"
                :data-list="teacherSuggest ? teacherSuggest : []"
                :row-height="39"
                :total-cnt="teaTotal"
                :list-cnt="8"
                admin-state="Y"
                @saveSuggestDetail="showSuggestDetail"
              >
              </data-list-component>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component title="건의 내용">
      <template v-slot:body>
        <div class="suggest-detail">
          <span class="suggest-detail-tip">
            답변을 작성 또는 수정하시려면 학생/강사 건의사항 서비스로 이동해
            주세요.
          </span>
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
                작성한 답변<span
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
              <div
                style="white-space: pre"
                class="suggest-detail-section-answer-item"
              >
                {{
                  suggestDetail?.answer
                    ? suggestDetail?.answer
                    : "작성한 답변이 없습니다."
                }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
