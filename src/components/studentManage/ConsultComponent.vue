<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DropBoxComponent from "../custom/DropBoxComponent.vue";
import { defaultInterface } from "../../lib/types";
/*
@brief 강사는 메인 카테고리 [학생 관리]의 [상담]으로 접근 가능
       관리자는 메인 카테고리 [학생 관리], [강사 관리]의 [상담]으로 접근 가능
       TODO 현재 상담의 정책 부분에 대한 협의가 진행 중
 */
export default defineComponent({
  name: "ConsultComponent",
  components: { DropBoxComponent },
  setup() {
    const date = ref<string | undefined>(undefined);
    const time = ref<string | undefined>(undefined);
    const inputDate = ref<Date | undefined>(undefined);
    const inputTime = ref<Date | undefined>(undefined);
    const inputName = ref<string | undefined>(undefined);
    const planDate = ref<Date | undefined>(undefined);
    const planName = ref<string | undefined>(undefined);
    const listDate = ref<Date | undefined>(undefined);
    const inputDateCalendarState = ref(false);
    const inputTimeCalendarState = ref(false);
    const planDateCalendarState = ref(false);
    const listDateCalendarState = ref(false);
    const typeList: defaultInterface[] = [
      { KEY: "STUDENT", VALUE: "학생" },
      { KEY: "PARENT", VALUE: "학부모" },
      { KEY: "ENTRANCE", VALUE: "입시" },
      { KEY: "SCORE", VALUE: "성적" },
      { KEY: "ETC", VALUE: "기타" },
    ];

    const openCalendar = (m: string, n: string) => {
      if (m === "input") {
        if (n === "date") {
          inputDateCalendarState.value = !inputDateCalendarState.value;
        } else {
          inputTimeCalendarState.value = !inputTimeCalendarState.value;
        }
      } else if (m === "plan") {
        planDateCalendarState.value = !planDateCalendarState.value;
      } else {
        listDateCalendarState.value = !listDateCalendarState.value;
      }
    };

    const selectType = (item: defaultInterface) => {
      // console.log("상담 유형:", item);
    };

    const insertConsult = () => {
      if (!date.value) {
        window.alert("상담 날짜를 입력해 주세요.");
      } else if (!time.value) {
        window.alert("상담 시간을 입력해 주세요.");
      } else if (!inputName.value) {
        window.alert("학생 이름을 입력해 주세요.");
      }
      let data = {
        date: date.value,
        time: time.value,
        name: inputName.value,
      };
    };

    watch(
      () => inputDate.value,
      () => {
        date.value = inputDate.value?.toDateString();
      }
    );

    watch(
      () => planDate.value,
      () => {
        date.value = planDate.value?.toDateString();
      }
    );

    watch(
      () => listDate.value,
      () => {
        date.value = listDate.value?.toDateString();
      }
    );

    watch(
      () => inputTime.value,
      () => {
        time.value = inputTime.value?.toTimeString().substring(0, 5);
      }
    );

    return {
      date,
      time,
      inputDate,
      inputTime,
      inputName,
      planDate,
      planName,
      inputDateCalendarState,
      inputTimeCalendarState,
      planDateCalendarState,
      listDateCalendarState,
      typeList,
      selectType,
      openCalendar,
      insertConsult,
    };
  },
});
</script>

<template>
  <section class="consult">
    <div class="consult">
      <div class="consult-input-section">
        <div class="consult-input-section-tag">상담 일정 입력</div>
        <div class="consult-input-section-body">
          <span class="consult-input-section-body-title">
            상담 정보를 추가해주세요.
          </span>
          <div class="consult-input-section-body-item">
            <div class="consult-input-section-body-item-date">
              <i class="fa-solid fa-filter"></i>
              {{ inputDate ? inputDate?.toDateString() : "상담 날짜" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('input', 'date')"
              ></i>
              <v-date-picker
                class="calendar-date"
                v-if="inputDateCalendarState"
                mode="date"
                v-model="inputDate"
                :minute-increment="5"
              />
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-time">
              <i class="fa-solid fa-clock"></i>
              {{ time ? time : "상담 시간" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('input', 'time')"
              ></i>
              <v-date-picker
                class="calendar-time"
                v-if="inputTimeCalendarState"
                mode="time"
                v-model="inputTime"
                :minute-increment="5"
                is24hr
              />
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-type">
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
                :select-list="typeList"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-name">
              <i class="fa-solid fa-user"></i>
              <input type="text" placeholder="이름" v-model="inputName" />
            </div>
            <div
              class="consult-input-section-body-item-insert"
              @click="insertConsult"
            >
              상담 일정 추가 하기
            </div>
          </div>
        </div>
      </div>

      <div class="consult-plan-section">
        <div class="consult-plan-section-tag">상담 예정 현황</div>
        <div class="consult-plan-section-body">
          <span class="consult-plan-section-body-title">
            상담이 완료되면 결과를 입력해 주세요.
          </span>
          <div class="consult-plan-section-body-item">
            <div class="consult-plan-section-body-item-date">
              <i class="fa-solid fa-filter"></i>
              {{ planDate ? planDate?.toDateString() : "상담 날짜" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('plan', 'date')"
              ></i>
              <v-date-picker
                class="calendar-date"
                v-if="planDateCalendarState"
                mode="date"
                v-model="planDate"
                :minute-increment="5"
              />
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-type">
              <drop-box-component
                placeholder="상담 유형"
                row-width="160px"
                :select-list="typeList"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-name">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                placeholder="학생 이름 검색"
                v-model="planName"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="consult-list-section">
        <div class="consult-list-section-tag">상담 목록 조회</div>
        <div class="consult-list-section-body"></div>
      </div>
    </div>
  </section>
</template>
