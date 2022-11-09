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
    const selectDate = ref<Date>(new Date());
    const selectTime = ref<Date>(new Date());
    const date = ref<string | undefined>(undefined);
    const time = ref<string | undefined>(undefined);
    const name = ref<string | undefined>(undefined);
    const dateCalendarState = ref(false);
    const timeCalendarState = ref(false);
    const typeList: defaultInterface[] = [
      { KEY: "STUDENT", VALUE: "학생" },
      { KEY: "PARENT", VALUE: "학부모" },
      { KEY: "ENTRANCE", VALUE: "입시" },
      { KEY: "SCORE", VALUE: "성적" },
      { KEY: "ETC", VALUE: "기타" },
    ];

    const openCalendar = (v: string) => {
      if (v === "date") {
        dateCalendarState.value = !dateCalendarState.value;
      } else {
        timeCalendarState.value = !timeCalendarState.value;
      }
    };

    const insertConsult = () => {
      if (!date.value) {
        window.alert("상담 날짜를 입력해 주세요.");
      }
      let data = {
        date: date.value,
        time: time.value,
        name: name.value,
      };

      console.log(data);
    };

    watch(
      () => selectDate.value,
      () => {
        date.value = selectDate.value?.toDateString();
      }
    );

    watch(
      () => selectTime.value,
      () => {
        time.value = selectTime.value?.toTimeString().substring(0, 5);
      }
    );

    return {
      selectDate,
      date,
      selectTime,
      time,
      name,
      dateCalendarState,
      timeCalendarState,
      typeList,
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
              {{ date ? date : "상담 날짜" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('date')"
              ></i>
              <v-date-picker
                class="calendar-date"
                v-if="dateCalendarState"
                mode="date"
                v-model="selectDate"
                :minute-increment="5"
              />
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-time">
              <i class="fa-solid fa-clock"></i>
              {{ time ? time : "상담 시간" }}
              <i
                class="fa-solid fa-chevron-down"
                @click="openCalendar('time')"
              ></i>
              <v-date-picker
                class="calendar-time"
                v-if="timeCalendarState"
                mode="time"
                v-model="selectTime"
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
              ></drop-box-component>
            </div>
            <span class="separ">|</span>
            <div class="consult-input-section-body-item-name">
              <i class="fa-solid fa-user"></i>
              <input type="text" placeholder="이름" v-model="name" />
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
        <div class="consult-plan-section-body">으이그</div>
      </div>

      <div class="consult-list-section">
        <div class="consult-list-section-tag">상담 목록 조회</div>
        <div class="consult-list-section-body">shit</div>
      </div>
    </div>
  </section>
</template>
