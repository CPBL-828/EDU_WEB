<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DataListComponent from "../components/custom/DataListComponent.vue";
import {
  defaultInterface,
  noticeInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import { useRoute, useRouter } from "vue-router";
import common from "../lib/common";
import { ApiClient } from "../axios";
import { KEYS, RESULT_KEY, USER_KEY } from "../constant";
import { useStore } from "vuex";
import ModalPopupComponent from "../components/custom/ModalPopupComponent.vue";
import DropBoxComponent from "../components/custom/DropBoxComponent.vue";
/*
@brief [강사, 학생, 학부모, 관리자] [Main]공지
       [Sub]전체 공지: 공지 데이터의 type이 '전체'인 것만 표시
       [Sub]내 공지: 현재 로그인한 user의 userKey를 getNoticeList parameter로 보내 해당 유저만 열람 가능한 공지 목록 표시
 */
export default defineComponent({
  name: "NoticePage",
  components: { DropBoxComponent, ModalPopupComponent, DataListComponent },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string>("");
    const adminState = ref(false);
    const header: defaultInterface[] = [
      { KEY: "TYPE", VALUE: "공지 유형" },
      { KEY: "TITLE", VALUE: "공지 제목" },
      { KEY: "DATE", VALUE: "작성일자" },
      { KEY: "WRITER", VALUE: "작성자" },
    ];
    const typePlaceholder = ref<string>("해당 없음");
    const noticeType: defaultInterface[] = [
      { KEY: "ALL", VALUE: "전체" },
      { KEY: USER_KEY.TEA, VALUE: "강사" },
      { KEY: USER_KEY.STU, VALUE: "학생" },
      // { KEY: USER_KEY.PAR, VALUE: "학부모" },
    ];
    const userList = ref<Array<defaultInterface> | undefined>(undefined);
    const noticeList = ref<Array<noticeInterface> | undefined>(undefined);
    const noticeInfo = ref<noticeInterface | undefined>(undefined);
    const writeState = ref(false);
    const totalCnt = ref<number | undefined>(undefined);
    const search = ref<string>("");
    const teacherList = ref<Array<defaultInterface> | undefined>(undefined);
    const studentList = ref<Array<defaultInterface> | undefined>(undefined);
    const reader = ref<defaultInterface | undefined>(undefined);
    const inputType = ref<string>("");
    const inputTitle = ref<string>("");
    const inputContent = ref<string>("");

    const getNoticeList = async () => {
      //TODO getNoticeList parameter: type, readerKey, year 추가
      let data = { userKey: "", search: search.value, date: "" };

      if (route.path === "/notice" || route.path === "/notice/all") {
        const result = await ApiClient(
          "/info/getNoticeList/",
          common.makeJson(data)
        );

        if (result) {
          if (result?.count > 0) {
            if (adminState.value) {
              noticeList.value = result.resultData;
            } else {
              noticeList.value = [];
              result.resultData.map((item: noticeInterface) => {
                if (item.type === "전체") {
                  noticeList.value?.push(item);
                }
              });
            }
          } else {
            noticeList.value = undefined;
          }
        }
      } else {
        data = Object.assign(data, { userKey: userKey.value });

        const result = await ApiClient(
          "/info/getNoticeList/",
          common.makeJson(data)
        );

        if (result) {
          if (result?.count > 0) {
            noticeList.value = result.resultData;
          } else {
            noticeList.value = undefined;
          }
        }
      }

      totalCnt.value = noticeList.value?.length;
    };

    const getTeacherList = async () => {
      let data = { search: "" };

      const result = await ApiClient(
        "/members/getTeacherList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          teacherList.value = [];
          result.resultData.map((item: teacherInterface) => {
            teacherList.value?.push({ KEY: item.teacherKey, VALUE: item.name });
          });
        }
      }
    };

    const getStudentList = async () => {
      let data = { userKey: userKey.value, search: "", lectureKey: "" };

      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          studentList.value = [];
          result.resultData.map((item: studentInterface) => {
            studentList.value?.push({ KEY: item.studentKey, VALUE: item.name });
          });
        }
      }
    };

    const writeNotice = async () => {
      await getTeacherList();
      await getStudentList();
      writeState.value = true;
      store.commit("setModalState", true);
    };

    const changeType = (t: defaultInterface) => {
      inputType.value = t.VALUE as string;
    };

    const changeReader = (r: defaultInterface) => {
      reader.value = { KEY: r.KEY, VALUE: r.VALUE as string };
    };

    const insertNotice = async () => {
      if (!inputType.value) {
        window.alert("공지 유형을 선택해주세요.");
        return false;
      } else if (!inputTitle.value) {
        window.alert("공지 제목을 작성해주세요.");
        return false;
      } else if (!inputContent.value) {
        window.alert("공지 내용을 작성해주세요.");
        return false;
      }

      if (inputType.value !== "전체" && !reader.value) {
        window.alert("공지 유형에 맞춰 열람 대상을 선택해주세요.");
        return false;
      }

      let data = {
        writerKey: userKey.value,
        readerKey: reader.value ? reader.value.KEY : "",
        readerNAme: reader.value ? reader.value.VALUE : "",
        type: inputType.value,
        title: inputTitle.value,
        content: inputContent.value,
        delState: "N",
      };

      const result = await ApiClient(
        "/info/createNotice/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          window.alert("공지를 작성했습니다.");
          router.go(0);
        }
      }
    };

    const showDetail = (i: noticeInterface) => {
      noticeInfo.value = i;
      writeState.value = false;
      store.commit("setModalState", true);
    };

    watch(
      () => route.path,
      async () => {
        category.value = common.findCategory();
        noticeList.value = undefined;
        await getNoticeList();
      }
    );

    watch(
      () => inputType.value,
      () => {
        if (inputType.value === "전체") {
          typePlaceholder.value = "해당 없음";
        } else {
          typePlaceholder.value = inputType.value + "명";

          if (inputType.value === "강사") {
            userList.value = teacherList.value;
          } else if (inputType.value === "학생") {
            userList.value = studentList.value;
          } else {
            userList.value = undefined;
          }
        }
      }
    );

    onMounted(async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.PAR) {
        userKey.value = common.getItem(KEYS.LU).parentKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.STU) {
        userKey.value = common.getItem(KEYS.LU).studentKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        userKey.value = common.getItem(KEYS.LU).teacherKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM) {
        userKey.value = common.getItem(KEYS.LU).adminKey;
        adminState.value = true;
      }
      category.value = common.findCategory();
      await getNoticeList();
    });

    return {
      category,
      adminState,
      header,
      typePlaceholder,
      noticeType,
      userList,
      noticeList,
      noticeInfo,
      writeState,
      totalCnt,
      search,
      inputType,
      inputTitle,
      inputContent,
      getNoticeList,
      writeNotice,
      changeType,
      changeReader,
      insertNotice,
      showDetail,
    };
  },
});
</script>

<template>
  <section class="notice">
    <div class="notice">
      <div class="notice-section">
        <div class="notice-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="notice-section-body">
          <div class="search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input
              type="text"
              v-model="search"
              placeholder="공지 제목 / 내용 검색"
              @keypress.enter="getNoticeList"
            />
          </div>
          <input
            type="button"
            value="작성하기"
            class="write-btn"
            v-if="adminState"
            @click="writeNotice"
          />
          <div class="notice-section-body-content">
            <data-list-component
              v-if="noticeList"
              :header="header"
              list-type="notice"
              :data-list="noticeList"
              :total-cnt="totalCnt ? totalCnt : 0"
              @showNoticeDetail="showDetail"
            ></data-list-component>
            <div class="no-data" v-if="!noticeList">
              불러올 데이터가 없습니다!
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component :title="writeState ? '공지 작성' : '공지 상세'">
      <template v-slot:body>
        <div class="notice-detail" v-if="!writeState">
          <div class="notice-detail-container">
            <div class="notice-detail-container-header">
              <div class="notice-detail-container-header-type">
                <div class="type-label">공지 유형</div>
                <div class="type-item">{{ noticeInfo?.type }}</div>
              </div>
              <div class="notice-detail-container-header-title">
                <div class="title-label">공지 제목</div>
                <div class="title-item">{{ noticeInfo?.title }}</div>
              </div>
              <div class="notice-detail-container-header-date">
                <div class="date-label">작성 일자</div>
                <div class="date-item">
                  {{ noticeInfo?.createDate.substring(0, 4) }}-{{
                    noticeInfo?.createDate.substring(5, 7)
                  }}-{{ noticeInfo?.createDate.substring(8, 10) }}
                </div>
              </div>
            </div>
            <div class="notice-detail-container-body">
              {{ noticeInfo?.content }}
            </div>
          </div>
        </div>

        <input
          type="button"
          class="write-btn"
          value="작성하기"
          @click="insertNotice"
          v-if="writeState"
        />
        <div class="notice-write" v-if="writeState">
          <div class="notice-write-container">
            <div class="notice-write-container-header">
              <div class="notice-write-type">
                <drop-box-component
                  placeholder="공지 유형"
                  :select-list="noticeType"
                  row-width="120px"
                  row-height="28px"
                  @selectValue="changeType"
                ></drop-box-component>
              </div>
              <div class="notice-write-type">
                <drop-box-component
                  :placeholder="typePlaceholder"
                  :select-list="userList"
                  row-width="130px"
                  row-height="28px"
                  @selectValue="changeReader"
                ></drop-box-component>
              </div>
              <div class="notice-write-container-header-title">
                <div class="title-label">공지 제목</div>
                <div class="title-item">
                  <input
                    type="text"
                    placeholder="제목을 입력해주세요."
                    v-model="inputTitle"
                  />
                </div>
              </div>
              <div class="notice-write-container-header-date">
                <div class="date-label">작성 일자</div>
                <div class="date-item">
                  {{ new Date().toISOString().substring(0, 10) }}
                </div>
              </div>
            </div>
            <div class="notice-write-container-body">
              <textarea
                placeholder="내용을 입력해주세요."
                class="suggestion-section-body-write-context"
                v-model="inputContent"
              />
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
