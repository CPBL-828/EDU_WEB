<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { adminInterface, teacherInterface } from "../lib/types";
export default defineComponent({
  name: "MyInfoComponent",
  props: {
    userData: {
      type: Object as PropType<teacherInterface | adminInterface>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>

<template>
  <section class="my-info">내 정보!!!!!!</section>
</template>
