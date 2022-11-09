<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
/*
@brief 헤더 우측 상단의 캘린더 팝업
       단순 날짜 확인용
 */
export default defineComponent({
  name: "CalendarPopup",
  setup() {
    const showState = ref(false);
    const date = ref<Date>(new Date());

    const changeShowState = () => {
      showState.value = !showState.value;
    };

    onMounted(() => {});

    return {
      showState,
      date,
      changeShowState,
    };
  },
});
</script>

<template>
  <div id="calendar-btn" @click="changeShowState"></div>
  <div class="calendar-section">
    <v-date-picker v-if="showState" mode="date" v-model="date"></v-date-picker>
  </div>
  <div v-if="showState" class="prevent-calendar"></div>
</template>
