<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import common from "../../lib/common";
import { defaultInterface, scheduleInterface } from "../../lib/types";
import { ApiClient } from "../../axios";
import { KEYS, USER_KEY } from "../../constant";
import PaginationComponent from "../fixed/PaginationComponent.vue";
/*
@brief [강사, 관리자] [Main]시간표 관리 [Sub]계획서 작성
       강사는 계획서 작성 및 작성한 계획서 목록 열람
       관리자는 강사가 작성한 계획서 열람 및 처리
 */
export default defineComponent({
  name: "PlanMakeComponent",
  components: { PaginationComponent },
  setup() {
    const userKey = ref<string | undefined>(undefined);
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const day: Array<string> = [
      "월요일",
      "화요일",
      "수요일",
      "목요일",
      "금요일",
      "토요일",
      "일요일",
    ];
    const header: defaultInterface[] = [
      { KEY: "name", VALUE: "강의명" },
      { KEY: "day", VALUE: "요일" },
      { KEY: "time", VALUE: "시작 시간" },
      { KEY: "progress", VALUE: "처리 상태" },
      { KEY: "planner", VALUE: "강의 계획서 작성" },
    ];
    const scheduleList = ref<Array<scheduleInterface>>([]);
    const showScheduleList = ref<Array<scheduleInterface>>([]);
    const page = ref<number>(0);
    const currentPage = ref<number>(1);

    const setLectureList = async () => {
      let data = {
        userKey: userKey.value,
        search: "",
        roomKey: "",
        target: "",
        roomName: "",
        lectureName: "",
      };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            if (item.progress !== "등록") {
              scheduleList.value.push(item as scheduleInterface);
              item.start = Number(item.startTime?.substring(0, 2));
              item.minute = Number(item.startTime?.substring(3, 5));
            }
          });
        }

        if (scheduleList.value.length > 11) {
          showScheduleList.value = scheduleList.value.slice(0, 11);
          page.value = Math.ceil(scheduleList.value.length / 11);
        } else {
          showScheduleList.value = scheduleList.value;
          page.value = 0;
        }
      }
    };

    const selectPage = (n: number) => {
      currentPage.value = n;
    };

    const changePage = (n: number) => {
      if (n === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    watch(
      () => currentPage.value,
      () => {
        showScheduleList.value = scheduleList.value.slice(
          11 * currentPage.value - 11,
          11 * currentPage.value
        );
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.LU)) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
          userKey.value = common.getItem(KEYS.LU).teacherKey;
        }
      }

      await setLectureList();
    });

    return {
      category,
      day,
      header,
      showScheduleList,
      page,
      currentPage,
      selectPage,
      changePage,
    };
  },
});
</script>

<template>
  <section class="planner">
    <div class="planner">
      <div class="planner-section">
        <div class="planner-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="planner-section-body">
          <div class="planner-section-body-list">
            <table>
              <thead>
                <tr>
                  <th class="name">{{ header[0].VALUE }}</th>
                  <th class="day">{{ header[1].VALUE }}</th>
                  <th class="time">{{ header[2].VALUE }}</th>
                  <th class="progress">{{ header[3].VALUE }}</th>
                  <th class="planner">{{ header[4].VALUE }}</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in showScheduleList">
                  <td class="name">{{ item.lectureName }}</td>
                  <td class="day">{{ day[item.day - 1] }}</td>
                  <td class="time">
                    {{ item.start }}:{{
                      item.minute === 0 ? item.minute + "0" : item.minute
                    }}
                  </td>
                  <td
                    class="progress"
                    :style="item.progress === '반려' ? 'color: red;' : ''"
                  >
                    {{ item.progress }}
                  </td>
                  <td class="planner">강의 계획서 작성하러 가기</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="planner-section-body-page">
            <pagination-component
              :page="page"
              :current-page="currentPage"
              @selectPage="selectPage"
              @changePage="changePage"
            ></pagination-component>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
