<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import CardListComponent from "./custom/CardListComponent.vue";
import {
  adminInterface,
  defaultInterface,
  scheduleInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import common from "../lib/common";
import { KEYS, USER_KEY } from "../constant";
import { ApiClient } from "../axios";
import DropBoxComponent from "./custom/DropBoxComponent.vue";
/*
@brief [강사] [Main]학생 관리, [관리자] [Main]학생 관리, 강사 관리
       [Sub]학생 정보, 강사 정보 접근 시 카드형 컴포넌트를 통해 유저 리스트 표시
@props 보여주고자 하는 유저 값
 */
export default defineComponent({
  name: "UserInfoComponent",
  props: {
    viewUser: {
      types: String as PropType<string>,
      required: true,
    },
  },
  components: { DropBoxComponent, CardListComponent },
  setup(props) {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const loginUser = ref<teacherInterface | adminInterface | undefined>(
      undefined
    );
    const teacherKey = ref<string>("");
    const userKey = ref<string | undefined>(undefined);
    const userData = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);
    const total = ref<string | undefined>(undefined);
    const search = ref<string | undefined>(undefined);
    const searchData = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);
    const lectureList = ref<Array<defaultInterface>>([]);
    const lectureKey = ref<string>("");

    const getUserList = async () => {
      let data = {
        userKey: "",
        search: "",
      };
      if (search.value) {
        data = Object.assign(data, { search: search.value });
      }
      if (common.getItem(KEYS.UK).userKey.slice(-3) !== USER_KEY.ADM) {
        data = Object.assign(data, {
          userKey: teacherKey.value,
        });
      } else {
        data = Object.assign(data, {
          userKey: "",
          lectureKey: lectureKey.value,
        });
      }

      if (props.viewUser === USER_KEY.STU) {
        data = Object.assign(data, { lectureKey: lectureKey.value });
        console.log(data);

        const result = await ApiClient(
          "/members/getStudentList/",
          common.makeJson(data)
        );

        if (result) {
          userData.value = [];

          if (result.count > 0) {
            userData.value = result.resultData as studentInterface[];
            total.value = result.count;
          } else {
            if (search.value) {
              window.alert("검색 내용을 찾을 수 없어요.");
            }
          }
        }
      } else {
        const result = await ApiClient(
          "/members/getTeacherList/",
          common.makeJson(data)
        );

        if (result) {
          userData.value = [];

          if (result.count > 0) {
            userData.value = result.resultData as teacherInterface[];
            total.value = result.count;
          } else {
            if (search.value) {
              window.alert("검색 내용을 찾을 수 없어요.");
            }
          }
        }
      }
    };

    const getScheduleList = async () => {
      let data = {
        userKey: teacherKey.value ? teacherKey.value : "",
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
            lectureList.value.push({
              KEY: item.lectureKey,
              VALUE: item.lectureName,
            });
          });
        }
      }
    };

    const selectLecture = async (item: defaultInterface) => {
      lectureKey.value = item.KEY;
      await getUserList();
    };

    onMounted(async () => {
      category.value = common.findCategory();
      userKey.value = common.getItem(KEYS.UK).userKey;

      if (common.getItem(KEYS.LU)) {
        if (userKey.value === USER_KEY.TEA) {
          loginUser.value = common.getItem(KEYS.LU) as teacherInterface;
          teacherKey.value = common.getItem(KEYS.LU).teacherKey;
        } else if (
          userKey.value === USER_KEY.KYO_ADM ||
          userKey.value === USER_KEY.ETC_ADM
        )
          loginUser.value = common.getItem(KEYS.LU) as adminInterface;
      }

      await getUserList();
      await getScheduleList();
    });

    return {
      category,
      teacherKey,
      userKey,
      userData,
      total,
      search,
      searchData,
      lectureList,
      getUserList,
      selectLecture,
    };
  },
});
</script>

<template>
  <section class="user-info">
    <div class="user-info">
      <div class="user-info-section">
        <div class="user-info-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="user-info-section-body" v-if="viewUser === 'STU'">
          <div class="filter">
            <div class="filter-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                v-model="search"
                placeholder="학생명, 학교명으로 검색"
                @keypress.enter="getUserList"
              />
            </div>
            <div class="sap"></div>
            <div class="filter-lecture">
              <drop-box-component
                :select-list="lectureList"
                placeholder="강의 선택"
                rowWidth="275px"
                @selectValue="selectLecture"
              ></drop-box-component>
            </div>
            <div class="sap" v-if="!teacherKey"></div>
            <input
              type="button"
              value="생성하기"
              class="filter-create-btn"
              v-if="!teacherKey"
            />
          </div>
          <span v-if="total" class="total">학생 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
          <span v-if="!userData" class="total"
            >등록된 학생 정보가 없습니다.</span
          >
        </div>
        <div class="user-info-section-body" v-if="viewUser === 'TEA'">
          <div class="filter">
            <div class="filter-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                v-model="search"
                placeholder="강사명, 담당 학년, 담당 과목으로 검색"
                @keypress.enter="getUserList"
              />
            </div>
            <div class="sap"></div>
            <input type="button" value="생성하기" class="filter-create-btn" />
          </div>
          <span v-if="total" class="total">강사 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
          <span v-if="!userData" class="total">
            등록된 강사 정보가 없습니다.
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
