<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "ScheduleAskComponent",
  setup() {
    return {};
  },
});
</script>

<template>
  <section class="schedule-ask">
    <div class="schedule-ask">
      <div class="schedule-ask-section">
        <div class="schedule-ask-section-tag">시간표 건의</div>
        <div class="schedule-ask-section-body">
          <div class="schedule-ask-section-body-today">날짜</div>
          <div class="schedule-ask-section-body-button">버튼</div>
          <div class="schedule-ask-section-body-data">시간표</div>
          <div class="schedule-ask-section-body-container">
            <div class="schedule-ask-section-body-container-write">
              <span class="schedule-ask-section-body-container-write-title"
                >건의 내용 선택</span
              >
              <div class="schedule-ask-section-body-container-write-drop1">
                과목 선택
              </div>
              <div class="schedule-ask-section-body-container-write-drop2">
                대상 학년 선택
              </div>
              <div class="schedule-ask-section-body-container-write-drop3">
                강의실 선택
              </div>
              <div class="schedule-ask-section-body-container-write-drop4">
                요일 선택
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
