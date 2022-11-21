<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import {
  defaultInterface,
  scheduleInterface,
  studentInterface,
} from "../../lib/types";
export default defineComponent({
  name: "AnalysisComponent",
  components: { DropBoxComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherKey = ref<string | undefined>(undefined);
    const placeholder = ref<string>("강의 선택");
    const lectureList = ref<defaultInterface[]>([]);
    const studentList = ref<studentInterface[] | undefined>(undefined);
    const selectStudentState = ref(false);

    const getLectureList = async () => {
      let data = { userKey: teacherKey.value, search: "" };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            lectureList.value.push({ KEY: item.lectureKey, VALUE: item.name });
          });
        }
      }
    };

    const getStudentList = async () => {
      let data = { userKey: teacherKey.value, search: "" };

      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          studentList.value = result.resultData as studentInterface[];
        }
      }
    };

    const selectStudent = (s: studentInterface) => {
      selectStudentState.value = true;
      console.log(s.studentKey);
    };

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey.value = common.getItem(KEYS.LU).teacherKey;
      }

      await getLectureList();
      await getStudentList();
    });

    return {
      category,
      placeholder,
      lectureList,
      studentList,
      selectStudentState,
      selectStudent,
    };
  },
});
</script>

<template>
  <section class="analysis-component" v-if="!selectStudentState">
    <div class="analysis-component">
      <div class="analysis-component-section">
        <div class="analysis-component-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="analysis-component-section-body">
          <div class="analysis-component-section-body-select">
            <div class="analysis-component-section-body-select-drop">
              <drop-box-component
                :placeholder="placeholder"
                :select-list="lectureList"
              ></drop-box-component>
            </div>
          </div>
          <div class="analysis-component-section-body-list">
            <div class="analysis-component-section-body-list-header">
              <div class="name-label">학생명</div>
              <div class="analysis-label">분석 내용</div>
            </div>
            <div
              class="analysis-component-section-body-list-item"
              v-for="item in studentList"
            >
              <i class="fa-solid fa-user" v-if="!item.profileImg"></i>
              <div class="analysis-component-section-body-list-item-name">
                {{ item.name }}
              </div>
              <div
                class="analysis-component-section-body-list-item-show"
                @click="selectStudent(item)"
              >
                열람하기
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="analysis-content" v-if="selectStudentState">
    <div class="analysis-content">
      <div class="analysis-content-section">
        <div class="analysis-content-section-tag">분석 내용 열람하기</div>
        <div class="analysis-content-section-body"></div>
      </div>
    </div>
  </section>
</template>
