<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "WorkReportComponent",
  setup() {
    return {};
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
            today
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
                    value="출근"
                  />
                </div>
              </div>
            </div>
            <div class="my-work-section-main-section-check">
              <div class="my-work-section-main-section-check-header">
                확인 원하는 일자 선택
              </div>
              <div class="my-work-section-main-section-check-calendar">
                calendar
              </div>
              <div class="my-work-section-main-section-check-record">
                출근부 기록 보기
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
