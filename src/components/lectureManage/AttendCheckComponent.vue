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
import { ApiClient } from "../../axios";
import { KEYS, RESULT_KEY, USER_KEY } from "../../constant";

interface sendingAttendInterface {
  studentName: string;
  studentKey: string;
  lectureName: string;
  lectureKey: string;
  state: string;
  reason: string;
}

export default defineComponent({
  name: "AttendCheckComponent",
  components: { SelectListComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const today = ref<Date>(new Date());
    const lectureDayState = ref(false);
    const teacherKey = ref<string>("");
    const selectState = ref(false);
    const lectureDetail = ref<scheduleInterface | undefined>(undefined);
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const existAttendState = ref(false);
    const attendStateList: defaultInterface[] = [
      { KEY: "OK", VALUE: "출석" },
      { KEY: "NO", VALUE: "결석" },
      { KEY: "LATE", VALUE: "지각" },
      { KEY: "ETC", VALUE: "보류" },
    ];
    const attendList = ref<Array<sendingAttendInterface>>([]);

    const selectLecture = (lecture: scheduleInterface) => {
      lectureDetail.value = lecture;
      selectState.value = true;

      if (today.value.getDay() !== 0) {
        if (today.value.getDay() === lectureDetail.value.day) {
          lectureDayState.value = true;
        }
      } else {
        if (lectureDetail.value.day === 7) {
          lectureDayState.value = true;
        }
      }
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
        attendList.value = [];

        if (result.count > 0) {
          studentList.value = result.resultData as studentInterface[];

          studentList.value.map((item: studentInterface) => {
            attendList.value.push({
              studentKey: item.studentKey,
              studentName: item.name,
              state: "",
              lectureName: lectureDetail.value?.lectureName
                ? lectureDetail.value?.lectureName
                : "",
              lectureKey: lectureDetail.value?.lectureKey
                ? lectureDetail.value?.lectureKey
                : "",
              reason: "",
            });
          });
        }
      }
    };

    const backToSelect = () => {
      lectureDetail.value = undefined;
      common.removeItem(KEYS.SS);
      selectState.value = false;
    };

    const getAttendList = async () => {
      let data = {
        lectureKey: lectureDetail.value?.lectureKey,
        userKey: "",
      };

      const result = await ApiClient(
        "/info/getAttendList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: attendInterface) => {
            attendList.value.map((sendingItem: sendingAttendInterface) => {
              if (
                new Date(item.createDate).toISOString().substring(0, 10) ===
                new Date().toISOString().substring(0, 10)
              ) {
                existAttendState.value = true;

                if (sendingItem.studentKey === item.studentKey_id) {
                  sendingItem.state = item.state;
                }
              }
            });
          });
        }
      }
    };

    const checkState = (student: string, attend: defaultInterface) => {
      attendList.value.map((item: sendingAttendInterface) => {
        if (item.studentKey === student) {
          item.state = attend.VALUE as string;
        }
      });
    };

    const doAllCheck = () => {
      if (existAttendState.value) {
        window.alert(
          "이미 출석 체크가 완료되었습니다.\n수정은 관리자에게 요청하세요."
        );
        return false;
      } else {
        attendList.value.map((item: sendingAttendInterface) => {
          item.state = "출석";
        });
      }
    };

    const createAttend = async () => {
      if (existAttendState.value) {
        window.alert(
          "이미 출석 체크가 완료되었습니다.\n수정은 관리자에게 요청하세요."
        );
        return false;
      } else {
        for (let i = 0; i < attendList.value?.length; i++) {
          if (!attendList.value[i].state) {
            window.alert(
              attendList.value[i].studentName +
                " 학생의 출결 상황을 선택해 주세요."
            );
            return false;
          }
        }

        if (
          window.confirm(
            "한 번 저장하면 수정할 수 없습니다.\n저장하시겠습니까?"
          )
        ) {
          const result = await ApiClient(
            "/info/createAttend/",
            common.makeJson(attendList.value)
          );

          if (result) {
            if (result.chunbae === RESULT_KEY.CREATE) {
              window.alert("저장되었습니다.");
              await getAttendList();
            }
          }
        } else {
          return false;
        }
      }
    };

    watch(
      () => selectState.value,
      async () => {
        if (selectState.value) {
          await getStudentList();
          await getAttendList();
        }
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK)) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
          teacherKey.value = common.getItem(KEYS.LU).teacherKey;
        }
      }
    });

    return {
      category,
      today,
      lectureDayState,
      selectState,
      lectureDetail,
      studentList,
      existAttendState,
      attendStateList,
      attendList,
      selectLecture,
      backToSelect,
      checkState,
      doAllCheck,
      createAttend,
    };
  },
});
</script>

<template>
  <section class="check">
    <div class="check-section">
      <div class="check-section-tag">
        {{
          category
            ? category[1]["VALUE"]
              ? category[1]["VALUE"]
              : category[0]["VALUE"]
            : ""
        }}
      </div>
      <div class="check-section-body">
        <div class="check-section-body-today" v-if="selectState">
          <i class="fa-regular fa-calendar"></i>
          TODAY : {{ today.toISOString().substring(0, 4) }}년
          {{ today.toISOString().substring(5, 7) }}월
          {{ today.toISOString().substring(8, 10) }}일
          {{ today.toString().substring(0, 4) }}
          <span class="back-btn" @click="backToSelect">강의 다시 선택하기</span>
        </div>
        <div class="check-section-body-lecture" v-if="!selectState">
          <select-list-component
            list-type="LECTURE"
            @selectLecture="selectLecture"
          ></select-list-component>
        </div>
        <div class="check-section-body-list" v-else>
          <div class="check-section-body-list-btn" v-if="!lectureDayState">
            오늘은 강의 날짜가 아닙니다.
          </div>
          <div class="check-section-body-list-btn" v-if="lectureDayState">
            <input
              type="button"
              value="전체 출석"
              class="all-btn"
              @click="doAllCheck"
            />
            <input
              type="button"
              value="저장하기"
              class="save-btn"
              @click="createAttend"
            />
          </div>
          <div class="check-section-body-list-table">
            <table>
              <thead style="text-align: center">
                <tr>
                  <td style="width: 20%">이름</td>
                  <td colspan="4" style="width: 80%">출석</td>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in attendList">
                  <td>{{ item.studentName }}</td>
                  <td
                    :class="
                      item.state === state.VALUE
                        ? 'check-selected-' + state.KEY
                        : 'check'
                    "
                    :style="{
                      transition: existAttendState ? 'all 0.1s' : 'all 0.2s',
                    }"
                    v-for="state in attendStateList"
                    @click="checkState(item.studentKey, state)"
                  >
                    <input
                      type="radio"
                      :id="item.studentKey + '-' + state.KEY"
                      name="check"
                      :value="state.VALUE"
                    />
                    <label :for="item.studentKey + '-' + state.KEY">{{
                      state.VALUE
                    }}</label>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div
            class="block-check"
            v-if="existAttendState || !lectureDayState"
          ></div>
        </div>
        <div class="no-data" v-if="selectState && !studentList">
          수강하는 학생이 없습니다.
        </div>
      </div>
    </div>
  </section>
</template>
