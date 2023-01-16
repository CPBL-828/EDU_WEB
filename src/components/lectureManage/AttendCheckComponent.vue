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
/*
@brief [강사] [Main]강의 관리
       [Sub]출석체크로 접근해서 출석 체크
       attendList 받아 와서 오늘자 출석 현황 존재 O/X에 따라 화면 컨트롤
 */
export default defineComponent({
  name: "AttendCheckComponent",
  components: { SelectListComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const today = ref<Date>(new Date());
    const isLectureDay = ref(false);
    const teacherKey = ref<string>("");
    const selectState = ref(false);
    const lectureInfo = ref<scheduleInterface | undefined>(undefined);
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const existAttend = ref(false);
    const attendList = ref<Array<sendingAttendInterface>>([]);
    const stateList: defaultInterface[] = [
      { KEY: "OK", VALUE: "출석" },
      { KEY: "NO", VALUE: "결석" },
      { KEY: "LATE", VALUE: "지각" },
      { KEY: "ETC", VALUE: "보류" },
    ];

    const selectLecture = (item: scheduleInterface) => {
      lectureInfo.value = item;
      selectState.value = true;

      if (today.value.getDay() !== 0) {
        if (today.value.getDay() === lectureInfo.value.day) {
          isLectureDay.value = true;
        }
      } else {
        if (lectureInfo.value.day === 7) {
          isLectureDay.value = true;
        }
      }
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
            attendList.value.push({
              studentKey: item.studentKey,
              studentName: item.name,
              state: "",
              lectureName: lectureInfo.value?.lectureName
                ? lectureInfo.value?.lectureName
                : "",
              lectureKey: lectureInfo.value?.lectureKey
                ? lectureInfo.value?.lectureKey
                : "",
              reason: "",
            });
          });
        }
      }
    };

    const getAttendList = async () => {
      let data = {
        lectureKey: lectureInfo.value?.lectureKey,
        userKey: "",
      };

      const result = await ApiClient(
        "/info/getAttendList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: attendInterface) => {
            attendList.value.map((state: sendingAttendInterface) => {
              if (
                new Date(item.createDate).toISOString().substring(0, 10) ===
                new Date().toISOString().substring(0, 10)
              ) {
                existAttend.value = true;

                if (state.studentKey === item.studentKey_id) {
                  state.state = item.state;
                }
              }
            });
          });
        }
      }
    };

    const checkState = (s: string, i: defaultInterface) => {
      attendList.value.map((item: sendingAttendInterface) => {
        if (item.studentKey === s) {
          item.state = i.VALUE as string;
        }
      });
    };

    const allCheck = () => {
      if (existAttend.value) {
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

    const saveAttend = async () => {
      if (existAttend.value) {
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
      isLectureDay,
      selectState,
      lectureInfo,
      studentList,
      existAttend,
      attendList,
      stateList,
      selectLecture,
      checkState,
      allCheck,
      saveAttend,
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
        </div>
        <div class="check-section-body-lecture" v-if="!selectState">
          <select-list-component
            list-type="LECTURE"
            @selectLecture="selectLecture"
          ></select-list-component>
        </div>
        <div class="check-section-body-list" v-else>
          <div class="check-section-body-list-btn" v-if="!isLectureDay">
            오늘은 강의 날짜가 아닙니다.
          </div>
          <div class="check-section-body-list-btn" v-if="isLectureDay">
            <input
              type="button"
              value="전체 출석"
              class="all-btn"
              @click="allCheck"
            />
            <input
              type="button"
              value="저장하기"
              class="save-btn"
              @click="saveAttend"
            />
          </div>
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
                    transition: existAttend ? 'all 0.1s' : 'all 0.2s',
                  }"
                  v-for="state in stateList"
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
          <div class="block-check" v-if="existAttend || !isLectureDay"></div>
        </div>
        <div class="no-data" v-if="selectState && !studentList">
          수강하는 학생이 없습니다.
        </div>
      </div>
    </div>
  </section>
</template>
