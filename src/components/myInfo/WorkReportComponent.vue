<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import {
  adminInterface,
  defaultInterface,
  teacherInterface,
} from "../../lib/types";
import { USER_KEY } from "../../constant";
export default defineComponent({
  name: "WorkReportComponent",
  props: {
    userKey: {
      type: String as PropType<string | undefined>,
      required: true,
    },
    userData: {
      type: Object as PropType<teacherInterface | adminInterface>,
      required: true,
    },
  },
  setup(props) {
    const today = ref<Date>(new Date());
    const date = ref<Date>(new Date());
    const teacherName = ref<string | undefined>(undefined);

    onMounted(() => {
      if (props.userKey === USER_KEY.TEA) {
        teacherName.value = (props.userData as teacherInterface).name;
      }
    });
    return {
      today,
      date,
      teacherName,
    };
  },
});
</script>

<template>
  <section class="my-work">
    <div class="my-work">
      <div class="my-work-section">
        <div class="my-work-section-tag">tag</div>
        <div class="my-work-section-main">
          <div class="my-work-section-main-today">
            <i class="fa-solid fa-calendar-week"></i>
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
                  <input
                    type="text"
                    class="my-work-section-main-section-input-section-come-date"
                    placeholder="날짜 및 현재 시간 선택"
                  />
                  <input
                    type="button"
                    class="my-work-section-main-section-input-section-come-btn"
                    value="출근"
                  />
                </div>
                <div class="my-work-section-main-section-input-section-out">
                  <input
                    type="text"
                    class="my-work-section-main-section-input-section-out-date"
                    placeholder="날짜 및 현재 시간 선택"
                  />
                  <input
                    type="button"
                    class="my-work-section-main-section-input-section-out-btn"
                    value="퇴근"
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
                <div class="user">{{ teacherName }} 강사님</div>

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
