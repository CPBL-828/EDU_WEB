<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface } from "../../lib/types";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
import SelectListComponent from "../custom/SelectListComponent.vue";

export default defineComponent({
  name: "ReportComponent",
  components: {
    SelectListComponent,
  },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const adminState = ref<boolean>(false);
    const selectRoomState = ref<boolean>(false);

    const selectRoom = () => {
      selectRoomState.value = true;
    };

    onMounted(() => {
      category.value = common.findCategory();

      if (
        common.getItem(KEYS.UK).userKey ===
        (USER_KEY.KYO_ADM || USER_KEY.ETC_ADM)
      ) {
        adminState.value = true;
      }
    });

    return {
      category,
      adminState,
      selectRoomState,
      selectRoom,
    };
  },
});
</script>

<template>
  <section class="lecture-report">
    <div class="lecture-report">
      <div class="lecture-report-section">
        <div class="lecture-report-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="lecture-report-section-body">
          <div class="lecture-report-section-body-room" v-if="adminState">
            <select-list-component
              v-if="!selectRoomState"
              list-type="ROOM"
              @selectRoom="selectRoom"
            ></select-list-component>
            <div class="lecture-report-section-body-content" v-else>
              <div class="lecture-report-section-body-content-today">
                <i class="fa-regular fa-calendar"></i> TODAY :
                {{ new Date().toISOString().substring(0, 4) }}년
                {{ new Date().toISOString().substring(5, 7) }}월
                {{ new Date().toISOString().substring(8, 10) }}일
                {{ new Date().toString().substring(0, 4) }}
              </div>
              <div class="lecture-report-section-body-content-search"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
