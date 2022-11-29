<script lang="ts">
import { defineComponent, ref } from "vue";
import ConsultComponent from "../studentManage/ConsultComponent.vue";
export default defineComponent({
  name: "AdminMainComponent",
  components: { ConsultComponent },
  setup() {
    return {};
  },
});
</script>

<template>
  <section class="admin-main">
    <div class="admin-main">
      <div class="admin-main-section">
        <div class="admin-main-section-left">
          <div class="admin-main-section-left-tag">학생 건의 내역</div>
          <div class="admin-main-section-left-body"></div>
        </div>
        <div class="admin-main-section-right">
          <div class="admin-main-section-right-tag">강사 건의 내역</div>
          <div class="admin-main-section-right-body"></div>
        </div>
      </div>
    </div>
  </section>
</template>
