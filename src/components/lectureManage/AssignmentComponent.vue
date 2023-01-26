<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  assignInterface,
  defaultInterface,
  scheduleInterface,
} from "../../lib/types";
import common from "../../lib/common";
import SelectListComponent from "../custom/SelectListComponent.vue";
import { ApiClient } from "../../axios";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import DataListComponent from "../custom/DataListComponent.vue";
export default defineComponent({
  name: "AssignmentComponent",
  components: { DataListComponent, SelectButtonComponent, SelectListComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
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

    const selectLecture = async (i: scheduleInterface) => {
      lectureInfo.value = i;
      await getAssignmentList();
      selectState.value = true;
    };

    const changeType = async (t: string) => {
      assignType.value = t;
      await getAssignmentList();
    };

    onMounted(() => {
      category.value = common.findCategory();
    });

    return {
      category,
      selectState,
      lectureInfo,
      assignHeader,
      assignList,
      totalCnt,
      assignTypeList,
      assignType,
      selectLecture,
      changeType,
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
                type="button"
                value="과제 업로드"
                class="assignment-section-body-content-title-btn-upload"
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
            ></data-list-component>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
