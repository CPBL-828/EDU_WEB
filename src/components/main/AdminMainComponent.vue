<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import ConsultComponent from "../studentManage/ConsultComponent.vue";
import common from "../../lib/common";
import { KEYS } from "../../constant";
import { ApiClient } from "../../axios";
export default defineComponent({
  name: "AdminMainComponent",
  components: { ConsultComponent },
  setup() {
    onMounted(async () => {
      let data = {
        userType: "ADM",
        search: "",
        writerType: "TEA",
        userKey: common.getItem(KEYS.LU).adminKey,
      };

      console.log(data);
      const result = await ApiClient(
        "/info/getSuggestList/",
        common.makeJson(data)
      );
      console.log(result);
    });
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
