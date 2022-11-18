<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import common from "../../lib/common";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import TimetableComponent from "../custom/TimetableComponent.vue";
import { KEYS, USER_KEY } from "../../constant";
import { ApiClient } from "../../axios";
import SelectButtonComponent from "../custom/SelectButtonComponent.vue";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
export default defineComponent({
  name: "CurrentScheduleComponent.vue",
  components: {
    ModalPopupComponent,
    SelectButtonComponent,
    TimetableComponent,
  },
  setup() {
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const scheduleList = ref<Array<scheduleInterface>>([]);
    const scheduleInfo = ref<scheduleInterface | undefined>(undefined);
    const selectItem: defaultInterface[] = [
      { KEY: "pm", VALUE: "오후" },
      { KEY: "am", VALUE: "오전" },
    ];
    const selectState = ref("pm");

    const changeState = (v: string) => {
      selectState.value = v;
    };

    const selectSchedule = (item: scheduleInterface) => {
      scheduleInfo.value = item;
    };

    const openModal = () => {
      store.commit("setModalState", true);
    };

    onMounted(async () => {
      category.value = common.findCategory();

      let teacherKey = "";
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        teacherKey = common.getItem(KEYS.LU).teacherKey;
      }
      let data = { userKey: teacherKey, search: "" };
      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            item.start = Number(item.startTime?.substring(0, 2));
            item.minute = Number(item.startTime?.substring(3, 5));
          });
          scheduleList.value = result.resultData as scheduleInterface[];
        }
      }
    });

    return {
      category,
      scheduleList,
      scheduleInfo,
      selectItem,
      selectState,
      changeState,
      selectSchedule,
      openModal,
    };
  },
});
</script>

<template>
  <section class="current-schedule">
    <div class="current-schedule">
      <div class="current-schedule-section">
        <div class="current-schedule-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="current-schedule-section-body">
          <div class="current-schedule-section-body-today">
            <i class="fa-regular fa-calendar"></i> TODAY :
            {{ new Date().toISOString().substring(0, 4) }}년
            {{ new Date().toISOString().substring(5, 7) }}월
            {{ new Date().toISOString().substring(8, 10) }}일
            {{ new Date().toString().substring(0, 4) }}
          </div>
          <div class="current-schedule-section-body-button">
            <div class="current-schedule-section-body-button-state">
              <select-button-component
                :state-value="selectItem"
                :select-value="selectState"
                @changeState="changeState"
              ></select-button-component>
            </div>
            <div class="current-schedule-section-body-button-past">
              이전 시간표 조회
            </div>
          </div>
          <div class="current-schedule-section-body-timetable">
            <timetable-component
              v-if="scheduleList.length > 0"
              :schedule-list="scheduleList"
              :select-type="selectState"
              @clickSchedule="selectSchedule"
            ></timetable-component>
          </div>
          <div class="current-schedule-section-body-info">
            <div class="current-schedule-section-body-info-container">
              <div class="info" v-if="!scheduleInfo">
                <div class="info-no-data">강의를 선택해 주세요</div>
                <div class="info-underline"></div>
              </div>
              <div class="info" v-if="scheduleInfo">
                <div class="info-name">{{ scheduleInfo.name }}</div>
                <div class="info-underline"></div>
                <div class="info-teacher">
                  <div class="label">강사명</div>
                  {{ scheduleInfo.teacherKey_id }}
                </div>
                <div class="info-book">
                  <div class="label">교재</div>
                  {{ scheduleInfo.book }}
                </div>
                <div class="info-grade">
                  <div class="label">학년</div>
                  {{ scheduleInfo.target }}
                </div>
                <div class="info-room">
                  <div class="label">강의실</div>
                  {{ scheduleInfo.roomKey_id }}
                </div>
                <div class="info-progress">
                  <div class="label">강의 진행표</div>
                  <div class="progress-btn" @click="openModal">열람하기</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modal-popup-component title="강의 진행표"> </modal-popup-component>
  </section>
</template>
