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
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";
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
  components: {
    ModalPopupComponent,
    DataListComponent,
    SelectLectureComponent,
  },
  setup() {
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherKey = ref<string>("");
    const studentInfo = ref<defaultInterface | undefined>(undefined);
    const selectState = ref(false);
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const lectureInfo = ref<scheduleInterface | undefined>(undefined);
    const header: Array<defaultInterface> = [
      { KEY: "NAME", VALUE: "이름" },
      { KEY: "CURRENT", VALUE: "현재 수업 일수" },
      { KEY: "ATTENDANCE", VALUE: "출석일" },
    ];
    const attendList = ref<Array<attendInterface> | undefined>(undefined);
    const totalCnt = ref(0);
    const totalDay = ref(0);
    const showAttendList = ref<Array<showAttendInterface>>([]);

    const detailHeader: defaultInterface[] = [
      { KEY: "DATE", VALUE: "수업일자" },
      { KEY: "STATE", VALUE: "출석 상태" },
      { KEY: "EDIT", VALUE: "수정 여부" },
      { KEY: "REASON", VALUE: "사유" },
    ];
    const studentAttendList = ref<Array<attendInterface> | undefined>(
      undefined
    );

    const selectLecture = (i: scheduleInterface) => {
      lectureInfo.value = i;
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
            totalCnt.value += 1;

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
        userKey: studentInfo.value ? studentInfo.value.KEY : "",
      };

      const result = await ApiClient(
        "/info/getAttendList/",
        common.makeJson(data)
      );

      if (result) {
        studentAttendList.value = undefined;
        if (result.count > 0) {
          totalDay.value = result.count / totalCnt.value;

          if (!studentInfo.value) {
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
          } else {
            studentAttendList.value = result.resultData as attendInterface[];
          }
        }
      }
    };

    const showAttendDetail = async (i: showAttendInterface) => {
      studentInfo.value = {
        KEY: i.studentKey,
        VALUE: i.studentName as string,
      };
      await getAttendList();
      store.commit("setModalState", true);
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
      studentInfo,
      selectState,
      studentList,
      attendList,
      lectureInfo,
      header,
      totalCnt,
      showAttendList,
      detailHeader,
      studentAttendList,
      selectLecture,
      showAttendDetail,
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
              list-type="LECTURE"
              @selectLecture="selectLecture"
            ></select-lecture-component>
          </div>
          <div class="attendance-section-body-list" v-else>
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
                @showAttendDetail="showAttendDetail"
              ></data-list-component>
            </div>
            <div v-else class="no-data">출결 데이터가 없습니다.</div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component title="출석 현황 상세 보기" modal-height="780px">
      <template v-slot:body>
        <div class="attend-detail">
          <span class="attend-detail-student">{{ studentInfo?.VALUE }}</span>
          <div class="attend-detail-list">
            <table v-if="studentAttendList">
              <thead>
                <tr>
                  <td v-for="item in detailHeader">{{ item.VALUE }}</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in studentAttendList">
                  <td>
                    {{ item.createDate.substring(0, 4) }}-{{
                      item.createDate.substring(5, 7)
                    }}-{{ item.createDate.substring(8, 10) }}
                  </td>
                  <td
                    :style="{
                      color: item.state === '결석' ? 'red' : '$sub-color',
                    }"
                  >
                    {{ item.state }}
                  </td>
                  <td>{{ item.editDate ? "O" : "X" }}</td>
                  <td>{{ item.reason ? item.reason : "" }}</td>
                </tr>
              </tbody>
            </table>
            <span v-else class="no-data">출결 데이터가 없습니다.</span>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
