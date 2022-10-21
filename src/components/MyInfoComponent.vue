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
    //push 할때 잠시 지워두기
    //props.userData;
    return {};
  },
});
</script>

<template>
  <section class="my-info">
    <div class="my-info">
      <div class="my-info-head">
        <div class="my-info-head-log">
          <div class="my-info-head-log-img"></div>
          <div class="my-info-head-log-text">log > log</div>
        </div>
      </div>
      <div class="my-info-body">내용물 들어갈 공간</div>
    </div>
  </section>
</template>
