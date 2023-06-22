<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CalendarPopup",
  setup() {
    const showState = ref(false);
    const date = ref<Date>(new Date());

    const changeShowState = () => {
      showState.value = !showState.value;
    };

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
