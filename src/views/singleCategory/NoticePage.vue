<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DataListComponent from "../../components/custom/DataListComponent.vue";
import {
  defaultInterface,
  noticeInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import { useRoute, useRouter } from "vue-router";
import common from "../../lib/common";
import { ApiClient } from "../../axios";
import { KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import { useStore } from "vuex";
import ModalPopupComponent from "../../components/custom/ModalPopupComponent.vue";
import DropBoxComponent from "../../components/custom/DropBoxComponent.vue";

export default defineComponent({
  name: "NoticePage",
  components: { DropBoxComponent, ModalPopupComponent, DataListComponent },
  setup() {
    const route = useRoute();
    const store = useStore();
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const userKey = ref<string>("");
    const adminState = ref(false);
    const noticeHeader: defaultInterface[] = [
      { KEY: "TYPE", VALUE: "공지 유형" },
      { KEY: "TITLE", VALUE: "공지 제목" },
      { KEY: "DATE", VALUE: "작성일자" },
      { KEY: "WRITER", VALUE: "작성자" },
    ];
    const typeHolder = ref<string>("해당 없음");
    const noticeTypeList: defaultInterface[] = [
      { KEY: "ALL", VALUE: "전체" },
      { KEY: USER_KEY.TEA, VALUE: "강사" },
      { KEY: USER_KEY.STU, VALUE: "학생" },
    ];
    const userList = ref<Array<defaultInterface> | undefined>(undefined);
    const noticeList = ref<Array<noticeInterface> | undefined>(undefined);
    const noticeDetail = ref<noticeInterface | undefined>(undefined);
    const writeState = ref(false);
    const totalCnt = ref<number | undefined>(undefined);
    const search = ref<string>("");
    const selectedType = ref<string>("");
    const selectedYear = ref<string>("");
    const yearList = ref<Array<defaultInterface> | undefined>(undefined);
    const teacherList = ref<Array<defaultInterface> | undefined>(undefined);
    const studentList = ref<Array<defaultInterface> | undefined>(undefined);
    const inputTarget = ref<defaultInterface | undefined>(undefined);
    const inputType = ref<string>("");
    const inputTitle = ref<string>("");
    const inputContent = ref<string>("");

    const getNoticeList = async () => {
      //TODO getNoticeList parameter: type, inputTargetKey, year 추가
      let data = {
        userKey: "",
        type: selectedType.value,
        search: search.value,
        date: selectedYear.value,
      };

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

    const selectType = async (type: defaultInterface) => {
      selectedType.value = type.VALUE as string;
      await getNoticeList();
    };

    const selectYear = async (year: defaultInterface) => {
      selectedYear.value = year.KEY;
      await getNoticeList();
    };

    const writeNotice = async () => {
      await getTeacherList();
      await getStudentList();
      writeState.value = true;
      store.commit("setModalState", true);
    };

    const changeType = (type: defaultInterface) => {
      inputType.value = type.VALUE as string;
    };

    const changeTarget = (target: defaultInterface) => {
      inputTarget.value = { KEY: target.KEY, VALUE: target.VALUE as string };
    };

    const createNotice = async () => {
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

      if (inputType.value !== "전체" && !inputTarget.value) {
        window.alert("공지 유형에 맞춰 열람 대상을 선택해주세요.");
        return false;
      }

      let data = {
        writerKey: userKey.value,
        inputTargetKey: inputTarget.value ? inputTarget.value.KEY : "",
        inputTargetNAme: inputTarget.value ? inputTarget.value.VALUE : "",
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

    const showNoticeDetail = (notice: noticeInterface) => {
      noticeDetail.value = notice;
      writeState.value = false;
      store.commit("setModalState", true);
    };

    watch(
      () => route.path,
      async () => {
        category.value = common.findCategory();
        noticeList.value = undefined;
        search.value = "";

        await getNoticeList();
      }
    );

    watch(
      () => inputType.value,
      () => {
        if (inputType.value === "전체") {
          typeHolder.value = "해당 없음";
          userList.value = undefined;
        } else {
          typeHolder.value = inputType.value + "명";

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

      yearList.value = [];

      for (let i = 2010; i <= new Date().getFullYear(); i++) {
        yearList.value.push({ KEY: i.toString(), VALUE: i.toString() });
      }

      await getNoticeList();
    });

    return {
      category,
      adminState,
      noticeHeader,
      typeHolder,
      noticeTypeList,
      userList,
      noticeList,
      noticeDetail,
      writeState,
      totalCnt,
      search,
      yearList,
      inputType,
      inputTitle,
      inputContent,
      getNoticeList,
      selectType,
      selectYear,
      writeNotice,
      changeType,
      changeTarget,
      createNotice,
      showNoticeDetail,
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
          <div class="notice-section-body-adm-filter" v-if="adminState">
            <div class="notice-section-body-adm-filter-type">
              <drop-box-component
                :select-list="noticeTypeList"
                placeholder="공지 유형"
                row-width="180px"
                row-height="33px"
                @selectValue="selectType"
              ></drop-box-component>
            </div>
            <div class="notice-section-body-adm-filter-year">
              <drop-box-component
                :select-list="yearList ? yearList : []"
                placeholder="연도별"
                row-height="33px"
                row-width="160px"
                @selectValue="selectYear"
              ></drop-box-component>
            </div>
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
              :header="noticeHeader"
              list-type="notice"
              :data-list="noticeList"
              :total-cnt="totalCnt ? totalCnt : 0"
              @showNoticeDetail="showNoticeDetail"
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
            <div class="notice-detail-container-noticeHeader">
              <div class="notice-detail-container-noticeHeader-type">
                <div class="type-label">공지 유형</div>
                <div class="type-item">{{ noticeDetail?.type }}</div>
              </div>
              <div class="notice-detail-container-noticeHeader-title">
                <div class="title-label">공지 제목</div>
                <div class="title-item">{{ noticeDetail?.title }}</div>
              </div>
              <div class="notice-detail-container-noticeHeader-date">
                <div class="date-label">작성 일자</div>
                <div class="date-item">
                  {{ noticeDetail?.createDate.substring(0, 4) }}-{{
                    noticeDetail?.createDate.substring(5, 7)
                  }}-{{ noticeDetail?.createDate.substring(8, 10) }}
                </div>
              </div>
            </div>
            <div style="white-space: pre" class="notice-detail-container-body">
              {{ noticeDetail?.content }}
            </div>
          </div>
        </div>

        <input
          type="button"
          class="write-btn"
          value="작성하기"
          @click="createNotice"
          v-if="writeState"
        />
        <div class="notice-write" v-if="writeState">
          <div class="notice-write-container">
            <div class="notice-write-container-noticeHeader">
              <div class="notice-write-type">
                <drop-box-component
                  placeholder="공지 유형"
                  :select-list="noticeTypeList"
                  row-width="120px"
                  row-height="31px"
                  @selectValue="changeType"
                ></drop-box-component>
              </div>
              <div class="notice-write-type">
                <drop-box-component
                  :placeholder="typeHolder"
                  :select-list="userList"
                  row-width="130px"
                  row-height="31px"
                  @selectValue="changeTarget"
                ></drop-box-component>
              </div>
              <div class="notice-write-container-noticeHeader-title">
                <div class="title-label">공지 제목</div>
                <div class="title-item">
                  <input
                    type="text"
                    placeholder="제목을 입력해주세요."
                    v-model="inputTitle"
                  />
                </div>
              </div>
              <div class="notice-write-container-noticeHeader-date">
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
