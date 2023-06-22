<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface, teacherInterface } from "../../lib/types";
import common from "../../lib/common";
import { ApiClient } from "../../axios";
import { KEYS, USER_KEY } from "../../constant";
import SelectListComponent from "../custom/SelectListComponent.vue";

export default defineComponent({
  name: "WorkReportComponent",
  components: { SelectListComponent },
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string | undefined>(undefined);
    const adminState = ref(false);
    const teacherData = ref<teacherInterface | undefined>(undefined);
    const today = ref<Date>(new Date());
    const date = ref<Date>(new Date());
    const comeTime = ref<Date>(new Date());
    const fixCome = ref<string>(new Date().toLocaleString());
    const outTime = ref<Date>(new Date());
    const fixOut = ref<string>(new Date().toLocaleString());

    const selectTeacher = (t: teacherInterface) => {
      teacherData.value = t;
    };

    const saveComeTime = async (t: Date) => {
      if (window.confirm(fixCome.value + "로 출근 시간을 저장하시겠습니까?")) {
        let data = {
          teacherKey: teacherData.value?.teacherKey,
          state: "출근",
          reason: "",
        };

        const result = await ApiClient(
          "/info/createWork/",
          common.makeJson(data)
        );
      } else {
        return false;
      }
    };

    const saveOutTime = async (t: Date) => {
      if (window.confirm(fixOut.value + "로 퇴근 시간을 저장하시겠습니까?")) {
        let data = {
          teacherKey: teacherData.value?.teacherKey,
          state: "퇴근",
          reason: "",
        };

        const result = await ApiClient(
          "/info/createWork/",
          common.makeJson(data)
        );
      } else {
        return false;
      }
    };

    onMounted(() => {
      category.value = common.findCategory();
      userKey.value = common.getItem(KEYS.UK).userKey;

      if (userKey.value === USER_KEY.TEA) {
        teacherData.value = common.getItem(KEYS.LU) as teacherInterface;
      } else if (userKey.value?.slice(-3) === USER_KEY.ADM) {
        adminState.value = true;
      }
    });

    return {
      category,
      adminState,
      teacherData,
      today,
      date,
      comeTime,
      fixCome,
      outTime,
      fixOut,
      selectTeacher,
      saveComeTime,
      saveOutTime,
    };
  },
});
</script>

<template>
  <section class="my-work">
    <div class="my-work">
      <div class="my-work-section">
        <div class="my-work-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="my-work-section-body" v-if="adminState && !teacherData">
          <div class="my-work-section-body-teacher">
            <select-list-component
              list-type="TEA"
              @selectTeacher="selectTeacher"
            ></select-list-component>
          </div>
        </div>
        <div class="my-work-section-body" v-else>
          <div class="my-work-section-body-today">
            <i class="fa-regular fa-calendar"></i>
            TODAY : {{ today.toISOString().substring(0, 4) }}년
            {{ today.toISOString().substring(5, 7) }}월
            {{ today.toISOString().substring(8, 10) }}일
            {{ today.toString().substring(0, 4) }}
          </div>
          <div class="my-work-section-body-section">
            <div class="my-work-section-body-section-input">
              <div class="my-work-section-body-section-input-section">
                <div class="my-work-section-body-section-input-section-guide">
                  출근부를 기록해주세요.
                </div>
                <div class="my-work-section-body-section-input-section-come">
                  <div
                    class="my-work-section-body-section-input-section-come-datetime"
                  >
                    <input type="text" :value="fixCome" :disabled="true" />
                  </div>
                  <input
                    type="button"
                    class="my-work-section-body-section-input-section-come-btn"
                    value="출근"
                    @click="saveComeTime(comeTime)"
                  />
                </div>
                <div class="my-work-section-body-section-input-section-out">
                  <div
                    class="my-work-section-body-section-input-section-out-datetime"
                  >
                    <input type="text" :value="fixOut" :disabled="true" />
                  </div>
                  <input
                    type="button"
                    class="my-work-section-body-section-input-section-out-btn"
                    value="퇴근"
                    @click="saveOutTime(outTime)"
                  />
                </div>
              </div>
            </div>
            <div class="my-work-section-body-section-check">
              <div class="my-work-section-body-section-check-header">
                확인 원하는 일자 선택
              </div>
              <div class="my-work-section-body-section-check-calendar">
                <v-date-picker
                  is-expended
                  mode="date"
                  v-model="date"
                ></v-date-picker>
              </div>
              <div class="my-work-section-body-section-check-record">
                <div class="title">출근부 기록 보기</div>

                <div class="date">
                  {{ date?.toISOString().substring(0, 4) }}년
                  {{ date?.toISOString().substring(5, 7) }}월
                  {{ date?.toISOString().substring(8, 10) }}일
                </div>
                <div class="user">{{ teacherData?.name }} 강사님</div>

                <div class="start">출근 -</div>
                <div class="end">퇴근 -</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
