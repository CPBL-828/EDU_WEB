<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  defaultInterface,
  scheduleInterface,
  testInterface,
  testStatusInterface,
} from "../../lib/types";
import common from "../../lib/common";
import SelectListComponent from "../../components/custom/SelectListComponent.vue";
import DataListComponent from "../../components/custom/DataListComponent.vue";
import { ApiClient } from "../../axios";
import { useStore } from "vuex";
import ModalPopupComponent from "../../components/custom/ModalPopupComponent.vue";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "TestManagePage",
  components: { ModalPopupComponent, DataListComponent, SelectListComponent },
  setup() {
    const store = useStore();
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
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

    const selectLecture = async (i: scheduleInterface) => {
      lectureInfo.value = i;
      await getTestList();
      selectState.value = true;
    };

    const showTestDetail = async (t: testInterface) => {
      testInfo.value = t;
      await getTestStatusList();
      store.commit("setModalState", true);
    };

    const showScore = () => {
      // scoreMode.value = true;
      store.commit("setModalState", false);
      router.push("/main");
    };

    watch(
      () => store.state.modalState,
      () => {
        if (!store.state.modalState) {
          scoreMode.value = false;
        }
      }
    );

    onMounted(() => {
      category.value = common.findCategory();
    });

    return {
      category,
      selectState,
      lectureInfo,
      testHeader,
      testList,
      testInfo,
      testStatus,
      totalCnt,
      scoreMode,
      selectLecture,
      showTestDetail,
      showScore,
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
            <div class="test-section-body-schedule-title">
              <span class="lecture-name">{{ lectureInfo?.lectureName }}</span>
              <span class="subject-name">{{ lectureInfo?.subject }}</span>
            </div>
            <div class="test-section-body-schedule-list">
              <data-list-component
                :header="testHeader"
                list-type="test"
                :data-list="testList ? testList : []"
                :total-cnt="totalCnt"
                @showTestDetail="showTestDetail"
              ></data-list-component>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      title="시험 상세 조회"
      modal-width="1078px"
      modal-height="750px"
    >
      <template v-slot:body>
        <div class="test-status">
          <div class="test-status-lecture">{{ testInfo?.lectureName }}</div>
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
