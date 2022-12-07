<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  attendInterface,
  defaultInterface,
  scheduleInterface,
  studentInterface,
} from "../../lib/types";
import common from "../../lib/common";
import SelectLectureComponent from "../custom/SelectLectureComponent.vue";
import { KEYS, USER_KEY } from "../../constant";
import DataListComponent from "../custom/DataListComponent.vue";
import { ApiClient } from "../../axios";
/*
@brief [강사, 관리자] [Main]강의 관리
       [Sub]출석부 접근 후, 강의 선택 시 표시되는 페이지
 */
export interface showAttendInterface {
  studentKey: string;
  studentName: string;
  totalDay: number;
  attendDay: number;
}
export default defineComponent({
  name: "AttendanceComponent",
  components: { DataListComponent, SelectLectureComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherKey = ref<string>("");
    const selectState = ref(false);
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const lectureInfo = ref<scheduleInterface | undefined>(undefined);
    const header: Array<defaultInterface> = [
      { KEY: "name", VALUE: "이름" },
      { KEY: "current", VALUE: "현재 수업 일수" },
      { KEY: "attendance", VALUE: "출석일" },
    ];
    const attendList = ref<Array<attendInterface> | undefined>(undefined);
    const totalCnt = ref(0);
    const totalDay = ref(0);
    const showAttendList = ref<Array<showAttendInterface>>([]);

    const selectLecture = (item: scheduleInterface) => {
      lectureInfo.value = item;
      selectState.value = true;
    };

    const getStudentList = async () => {
      let data = {
        userKey: teacherKey.value,
        search: "",
        lectureKey: lectureInfo.value?.lectureKey,
      };

      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          studentList.value = result.resultData as studentInterface[];

          studentList.value.map((item: studentInterface) => {
            showAttendList.value.push({
              studentKey: item.studentKey,
              studentName: item.name,
              totalDay: 0,
              attendDay: 0,
            });
          });
        }
      }
    };

    const getAttendList = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
      };

      const result = await ApiClient(
        "/info/getAttendList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          totalDay.value = result.count / 3;
          attendList.value = result.resultData as attendInterface[];

          attendList.value.map((item: attendInterface) => {
            showAttendList.value.map((attend: showAttendInterface) => {
              attend.totalDay = totalDay.value;
              if (attend.studentKey === item.studentKey_id) {
                if (item.state === "출석") {
                  attend.attendDay += 1;
                }
              }
            });
          });

          totalCnt.value = showAttendList.value?.length;
        }
      }
    };

    watch(
      () => selectState.value,
      async () => {
        await getStudentList();
        await getAttendList();
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey.value = common.getItem(KEYS.LU).teacherKey;
      }
    });

    return {
      category,
      selectState,
      studentList,
      attendList,
      lectureInfo,
      header,
      showAttendList,
      totalCnt,
      selectLecture,
    };
  },
});
</script>

<template>
  <section class="attendance">
    <div class="attendance">
      <div class="attendance-section">
        <div class="attendance-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="attendance-section-body">
          <div class="attendance-section-body-lecture" v-if="!selectState">
            <select-lecture-component
              @selectLecture="selectLecture"
            ></select-lecture-component>
          </div>
          <div class="attendance-section-body-list" v-if="selectState">
            <span class="attendance-section-body-list-title">출석 현황</span>
            <span class="attendance-section-body-list-lecture">{{
              lectureInfo?.lectureName
            }}</span>
            <div class="attendance-section-body-list-data" v-if="attendList">
              <data-list-component
                :total-cnt="totalCnt ? totalCnt : 0"
                :data-list="showAttendList"
                list-type="attend"
                :header="header"
                :list-cnt="12"
                :row-height="40"
              ></data-list-component>
            </div>
            <div v-else class="no-data">출결 데이터가 없습니다.</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
