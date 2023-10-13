<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "CalendarPopup",
  setup() {
    const viewState = ref(false);
    const today = ref<Date>(new Date());

    const changeViewState = () => {
      viewState.value = !viewState.value;
    };

    return {
      viewState,
      today,
      changeViewState,
    };
  },
});
</script>

<template>
  <div id="calendar-btn" @click="changeViewState"></div>
  <div class="calendar-section">
    <v-date-picker v-if="viewState" mode="date" v-model="today"></v-date-picker>
  </div>
  <div v-if="viewState" class="prevent-calendar"></div>
</template>
