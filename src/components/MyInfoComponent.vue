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
  setup(props) {
    //props.userData;
    return {};
  },
});
</script>

<template>
  <section class="my-info">
    <div class="my-info">
      <div class="my-info-head">log할거임</div>
      <div class="my-info-body">내용물 들어갈 공간</div>
    </div>
  </section>
</template>
