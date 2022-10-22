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
          <div class="my-info-head-log-text">내정보 > 출근부</div>
        </div>
      </div>
      <div class="my-info-body">
        <div class="my-info-body-section">
          <div class="my-info-body-section-tag">tag</div>
          <div class="my-info-body-section-main">
            <div class="my-info-body-section-main-info">
              <div class="my-info-body-section-main-info-img">img</div>
              <div class="my-info-body-section-main-info-text">
                <div class="my-info-body-section-main-info-text-name">
                  이름 : name
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
