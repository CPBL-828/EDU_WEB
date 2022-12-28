<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ConsultComponent from "../studentManage/ConsultComponent.vue";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import { defaultInterface, suggestInterface } from "../../lib/types";
import DataListComponent from "../custom/DataListComponent.vue";
/*
@brief [관리자] 로그인 성공 후 가장 초기 메인 화면
       강사와 학생의 건의 목록은 양쪽에 표시
 */
export default defineComponent({
  name: "AdminMainComponent",
  components: { DataListComponent, ConsultComponent },
  setup() {
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
              >
              </data-list-component>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
