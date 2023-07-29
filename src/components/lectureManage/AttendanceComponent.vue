<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import {
  attendInterface,
  defaultInterface,
  scheduleInterface,
  studentInterface,
} from "../../lib/types";
import common from "../../lib/common";
import SelectListComponent from "../custom/SelectListComponent.vue";
import { KEYS, USER_KEY } from "../../constant";
import DataListComponent from "../custom/DataListComponent.vue";
import { ApiClient } from "../../axios";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";

export interface viewAttendInterface {
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
    SelectListComponent,
  },
  setup() {
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherKey = ref<string>("");
    const selectLectureState = ref(false);
    const lectureDetail = ref<scheduleInterface | undefined>(undefined);
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const attendListHeader: Array<defaultInterface> = [
      { KEY: "NAME", VALUE: "이름" },
      { KEY: "CURRENT", VALUE: "현재 수업 일수" },
      { KEY: "ATTENDANCE", VALUE: "출석일" },
    ];
    const attendList = ref<Array<attendInterface> | undefined>(undefined);
    const viewAttendList = ref<Array<viewAttendInterface>>([]);
    const totalDay = ref(0);
    const totalCnt = ref(0);

    const attendDetailHeader: defaultInterface[] = [
      { KEY: "DATE", VALUE: "수업일자" },
      { KEY: "STATE", VALUE: "출석 상태" },
      { KEY: "EDIT", VALUE: "수정 여부" },
      { KEY: "REASON", VALUE: "사유" },
    ];
    const selectedStudent = ref<defaultInterface | undefined>(undefined);
    const studentAttendList = ref<Array<attendInterface> | undefined>(
      undefined
    );

    const selectLecture = (lecture: scheduleInterface) => {
      lectureDetail.value = lecture;
      selectLectureState.value = true;
    };

    //TODO getStudentList -> getLectureStatusList
    const getStudentList = async () => {
      let data = {
        userKey: teacherKey.value,
        search: "",
        lectureKey: lectureDetail.value?.lectureKey,
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

            viewAttendList.value.push({
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
        lectureKey: lectureDetail.value?.lectureKey,
        userKey: selectedStudent.value ? selectedStudent.value.KEY : "",
      };

      const result = await ApiClient(
        "/info/getAttendList/",
        common.makeJson(data)
      );

      if (result) {
        studentAttendList.value = undefined;
        if (result.count > 0) {
          totalDay.value = Math.floor(result.count / totalCnt.value);

          if (!selectedStudent.value) {
            attendList.value = result.resultData as attendInterface[];

            attendList.value.map((item: attendInterface) => {
              viewAttendList.value.map((viewItem: viewAttendInterface) => {
                viewItem.totalDay = totalDay.value;
                if (viewItem.studentKey === item.studentKey_id) {
                  if (item.state === "출석") {
                    viewItem.attendDay += 1;
                  }
                }
              });
            });

            totalCnt.value = viewAttendList.value?.length;
          } else {
            studentAttendList.value = result.resultData as attendInterface[];
          }
        }
      }
    };

    const showAttendDetail = async (attend: viewAttendInterface) => {
      selectedStudent.value = {
        KEY: attend.studentKey,
        VALUE: attend.studentName as string,
      };

      await getAttendList();
      store.commit("setModalState", true);
    };

    watch(
      () => selectLectureState.value,
      async () => {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.PAR) {
        } else {
          await getStudentList();
        }
        await getAttendList();
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey.value = common.getItem(KEYS.LU).teacherKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.PAR) {
        const child = await common.setChildren(
          common.getItem(KEYS.LU).parentKey
        );

        if (child) {
          selectedStudent.value = {
            KEY: child.studentKey,
            VALUE: child.name,
          };
        }
      }
    });

    return {
      category,
      selectLectureState,
      lectureDetail,
      studentList,
      attendListHeader,
      attendList,
      viewAttendList,
      totalCnt,
      attendDetailHeader,
      selectedStudent,
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
          <div
            class="attendance-section-body-lecture"
            v-if="!selectLectureState"
          >
            <select-list-component
              list-type="LECTURE"
              @selectLecture="selectLecture"
            ></select-list-component>
          </div>
          <div class="attendance-section-body-list" v-else>
            <span class="attendance-section-body-list-title">출석 현황</span>
            <span class="attendance-section-body-list-lecture">{{
              lectureDetail?.lectureName
            }}</span>
            <div class="attendance-section-body-list-data" v-if="attendList">
              <data-list-component
                :total-cnt="totalCnt ? totalCnt : 0"
                :data-list="viewAttendList"
                list-type="attend"
                :header="attendListHeader"
                :list-cnt="12"
                :row-height="40"
                @showAttendDetail="showAttendDetail"
              ></data-list-component>
            </div>
            <div
              class="attendance-section-body-list-stu"
              v-else-if="studentAttendList"
            >
              <table>
                <thead>
                  <tr>
                    <th
                      :style="{
                        width: '25%',
                      }"
                    >
                      날짜
                    </th>
                    <th
                      :style="{
                        width: '25%',
                      }"
                    >
                      출석 상태
                    </th>
                    <th
                      :style="{
                        width: '50%',
                      }"
                    >
                      사유
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in studentAttendList">
                    <td>{{ item.createDate.split("T")[0] }}</td>
                    <td>{{ item.state }}</td>
                    <td>{{ item.reason ? item.reason : "내용 없음" }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="no-data">출결 데이터가 없습니다.</div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component title="출석 현황 상세 보기" modal-height="780px">
      <template v-slot:body>
        <div class="attend-detail">
          <span class="attend-detail-student">{{
            selectedStudent?.VALUE
          }}</span>
          <div class="attend-detail-list">
            <table v-if="studentAttendList">
              <thead>
                <tr>
                  <td v-for="item in attendDetailHeader">{{ item.VALUE }}</td>
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
