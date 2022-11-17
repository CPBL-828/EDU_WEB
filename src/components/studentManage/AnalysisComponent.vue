<script lang="ts">
import { defineComponent, ref } from "vue";
export default defineComponent({
  name: "AnalysisComponent",
  setup() {
    return {};
  },
});
</script>

<template>
  <section class="analysis-component">
    <div class="analysis-component">
      <div class="analysis-component-section">
        <div class="analysis-component-section-tag">분석</div>
        <div class="analysis-component-section-body">
          <div class="analysis-component-section-body-select">
            <div class="analysis-component-section-body-select-drop">
              강의 선택
            </div>
          </div>
          <div class="analysis-component-section-body-list">학생 리스트</div>
        </div>
      </div>
    </div>
  </section>
</template>
