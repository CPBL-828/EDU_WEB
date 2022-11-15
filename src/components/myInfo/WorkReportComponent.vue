<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import { defaultInterface, teacherInterface } from "../../lib/types";
import common from "../../lib/common";
/*
@brief 강사의 출근부 입력 및 열람 페이지
@props 강사/관리자 중 현재 로그인 한 유저의 권한 값
 */
export default defineComponent({
  name: "WorkReportComponent",
  props: {
    userKey: {
      type: String as PropType<string>,
      required: true,
    },
    userData: {
      type: Object as PropType<teacherInterface>,
      required: true,
    },
  },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const today = ref<Date>(new Date());
    const date = ref<Date>(new Date());
    const comeTime = ref<Date>(new Date());
    const fixCome = ref<Date | undefined>(undefined);
    const outTime = ref<Date>(new Date());
    const fixOut = ref<Date | undefined>(undefined);
    const calendarState = ref<string | undefined>(undefined);

    const openCalendar = (v: string) => {
      if (calendarState.value !== undefined) {
        calendarState.value = undefined;
      } else {
        if (v === "come") {
          calendarState.value = "come";
        } else {
          calendarState.value = "out";
        }
      }
    };

    const onClickAway = (event: Event) => {
      if (event.isTrusted) {
        calendarState.value = undefined;
      }
    };

    const saveComeTime = (t: Date) => {
      calendarState.value = undefined;
      fixCome.value = t;
    };

    const saveOutTime = (t: Date) => {
      calendarState.value = undefined;
      fixOut.value = t;
    };

    onMounted(() => {
      category.value = common.findCategory();
    });

    return {
      category,
      today,
      date,
      comeTime,
      fixCome,
      outTime,
      fixOut,
      calendarState,
      openCalendar,
      onClickAway,
      saveComeTime,
      saveOutTime,
    };
  },
});
</script>

<template>
  <section class="my-work">
    <div class="my-work">
      <div class="my-work-section">
        <div class="my-work-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="my-work-section-main">
          <div class="my-work-section-main-today">
            <i class="fa-regular fa-calendar"></i>
            TODAY : {{ today.toISOString().substring(0, 4) }}년
            {{ today.toISOString().substring(5, 7) }}월
            {{ today.toISOString().substring(8, 10) }}일
            {{ today.toString().substring(0, 4) }}
          </div>
          <div class="my-work-section-main-section">
            <div class="my-work-section-main-section-input">
              <div class="my-work-section-main-section-input-section">
                <div class="my-work-section-main-section-input-section-guide">
                  출근부에 기록될 일자를 입력해주세요.
                </div>
                <div class="my-work-section-main-section-input-section-come">
                  <div
                    class="my-work-section-main-section-input-section-come-datetime"
                  >
                    <input
                      type="text"
                      :value="
                        fixCome
                          ? fixCome.toLocaleString().slice(0, -3)
                          : '날짜 및 현재 시간 선택'
                      "
                      :disabled="true"
                    />
                    <i
                      class="fa-solid fa-chevron-down"
                      @click="openCalendar('come')"
                    ></i>
                  </div>
                  <input
                    type="button"
                    class="my-work-section-main-section-input-section-come-btn"
                    value="출근"
                    @click="saveComeTime(comeTime)"
                  />
                  <v-date-picker
                    :class="
                      calendarState === 'come' ? 'calendar-come' : 'calendar'
                    "
                    mode="time"
                    v-model="comeTime"
                    :minute-increment="10"
                  />
                </div>
                <div class="my-work-section-main-section-input-section-out">
                  <div
                    class="my-work-section-main-section-input-section-out-datetime"
                  >
                    <input
                      type="text"
                      :value="
                        fixOut
                          ? fixOut.toLocaleString().slice(0, -3)
                          : '날짜 및 현재 시간 선택'
                      "
                      :disabled="true"
                    />
                    <i
                      class="fa-solid fa-chevron-down"
                      @click="openCalendar('out')"
                    ></i>
                  </div>
                  <input
                    type="button"
                    class="my-work-section-main-section-input-section-out-btn"
                    value="퇴근"
                    @click="saveOutTime(outTime)"
                  />
                  <v-date-picker
                    :class="
                      calendarState === 'out' ? 'calendar-out' : 'calendar'
                    "
                    mode="time"
                    v-model="outTime"
                    :minute-increment="10"
                  />
                </div>
              </div>
            </div>
            <div class="my-work-section-main-section-check">
              <div class="my-work-section-main-section-check-header">
                확인 원하는 일자 선택
              </div>
              <div class="my-work-section-main-section-check-calendar">
                <v-date-picker
                  is-expended
                  mode="date"
                  v-model="date"
                ></v-date-picker>
              </div>
              <div class="my-work-section-main-section-check-record">
                <div class="title">출근부 기록 보기</div>

                <div class="date">
                  {{ date?.toISOString().substring(0, 4) }}년
                  {{ date?.toISOString().substring(5, 7) }}월
                  {{ date?.toISOString().substring(8, 10) }}일
                </div>
                <div class="user">{{ userData.name }} 강사님</div>

                <div class="start">출근 -</div>
                <div class="end">퇴근 -</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
