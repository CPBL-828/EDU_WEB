<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
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
  <div class="prevent-calendar"></div>
</template>
