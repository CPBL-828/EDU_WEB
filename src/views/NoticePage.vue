<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import DataListComponent from "../components/custom/DataListComponent.vue";
import { defaultInterface, noticeInterface } from "../lib/types";
import { useRoute } from "vue-router";
import common from "../lib/common";
import { ApiClient } from "../axios";
import { KEYS, USER_KEY } from "../constant";
import { useStore } from "vuex";
import ModalPopupComponent from "../components/custom/ModalPopupComponent.vue";
/*
@brief [강사, 학생, 학부모, 관리자] [Main]공지
       [Sub]전체 공지: 공지 데이터의 type이 '전체'인 것만 표시
       [Sub]내 공지: 현재 로그인한 user의 userKey를 getNoticeList parameter로 보내 해당 유저만 열람 가능한 공지 목록 표시
 */
export default defineComponent({
  name: "NoticePage",
  components: { ModalPopupComponent, DataListComponent },
  setup() {
    const store = useStore();
    const route = useRoute();
    const userKey = ref<string>("");
    const adminState = ref(false);
    const header: defaultInterface[] = [
      { KEY: "TYPE", VALUE: "공지 유형" },
      { KEY: "TITLE", VALUE: "공지 제목" },
      { KEY: "DATE", VALUE: "작성일자" },
      { KEY: "WRITER", VALUE: "작성자" },
    ];
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const noticeList = ref<Array<noticeInterface> | undefined>(undefined);
    const noticeInfo = ref<noticeInterface | undefined>(undefined);
    const totalCnt = ref<number | undefined>(undefined);
    const search = ref<string>("");

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

    const showDetail = (item: noticeInterface) => {
      noticeInfo.value = item;
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

    onMounted(async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.PAR) {
        userKey.value = common.getItem(KEYS.LU).parentKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.STU) {
        userKey.value = common.getItem(KEYS.LU).studentKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        userKey.value = common.getItem(KEYS.LU).teacherKey;
      } else if (common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM) {
        adminState.value = true;
      }
      category.value = common.findCategory();
      await getNoticeList();
    });

    return {
      adminState,
      header,
      category,
      noticeList,
      noticeInfo,
      totalCnt,
      search,
      getNoticeList,
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

    <modal-popup-component title="공지 상세">
      <template v-slot:body>
        <div class="notice-detail">
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
      </template>
    </modal-popup-component>
  </section>
</template>
