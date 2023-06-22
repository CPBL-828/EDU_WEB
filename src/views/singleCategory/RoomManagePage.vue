<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { defaultInterface, roomInterface } from "../../lib/types";
import common from "../../lib/common";
import { ApiClient } from "../../axios";
import PaginationComponent from "../../components/fixed/PaginationComponent.vue";
import DropBoxComponent from "../../components/custom/DropBoxComponent.vue";
import { useRouter } from "vue-router";
import { KEYS, RESULT_KEY, USER_KEY } from "../../constant";

export default defineComponent({
  name: "RoomManagePage",
  components: { DropBoxComponent, PaginationComponent },
  setup() {
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const isKyo = ref(false);
    const editState = ref(false);
    const roomList = ref<Array<roomInterface>>([]);
    const showRoomList = ref<Array<roomInterface>>([]);
    const roomInfo = ref<roomInterface | undefined>(undefined);
    const page = ref<number>(0);
    const currentPage = ref<number>(1);
    const typePlaceholder = ref<string>("강의실 유형을 선택해주세요.");
    const typeList: Array<defaultInterface> = [
      { KEY: "basic", VALUE: "일반" },
      { KEY: "self", VALUE: "자습실" },
      { KEY: "reference", VALUE: "자료실" },
      { KEY: "etc", VALUE: "기타" },
    ];
    const roomKey = ref<string>("");
    const roomName = ref<string | undefined>(undefined);
    const totalPeople = ref<number | undefined>(undefined);
    const roomType = ref<string | undefined>(undefined);
    const beforeName = ref<string>("");
    const beforeTotal = ref<number>(0);
    const beforeType = ref<string>("");

    const setRoomList = async () => {
      let data = { search: "" };
      const result = await ApiClient(
        "/lectures/getRoomList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          roomList.value = result.resultData as roomInterface[];
        }
      }

      if (roomList.value.length > 12) {
        showRoomList.value = roomList.value.slice(0, 12);
        page.value = Math.ceil(roomList.value.length / 12);
      } else {
        showRoomList.value = roomList.value;
        page.value = 0;
      }
    };

    const selectPage = (p: number) => {
      currentPage.value = p;
    };

    const changePage = (p: number) => {
      if (p === 1) currentPage.value = currentPage.value + 1;
      else currentPage.value = currentPage.value - 1;
    };

    const selectRoomType = (t: defaultInterface) => {
      roomType.value = t.VALUE as string;
    };

    const saveRoom = async () => {
      if (!roomName.value) {
        window.alert("강의실 명을 입력해주세요.");
        return false;
      } else if (!totalPeople.value) {
        window.alert("수용 인원을 입력해주세요.");
        return false;
      } else if (!roomType.value) {
        window.alert("강의실 유형을 선택해주세요.");
        return false;
      }

      let data = {
        name: roomName.value,
        totalPeople: totalPeople.value,
        type: roomType.value,
      };

      const result = await ApiClient(
        "/lectures/createRoom/",
        common.makeJson(data)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          window.alert("강의실을 생성했습니다.");
          router.go(0);
        }
      } else {
        window.alert("강의실 생성에 실패했습니다.");
        return false;
      }
    };

    const editRoom = (i: roomInterface) => {
      editState.value = true;

      roomKey.value = i.roomKey;
      roomName.value = i.name;
      beforeName.value = i.name;
      roomType.value = i.type;
      beforeType.value = i.type;
      typePlaceholder.value = i.type;
      totalPeople.value = i.totalPeople;
      beforeTotal.value = i.totalPeople;
    };

    const removeRoom = async (i: roomInterface) => {
      if (window.confirm(i.name + " 강의실을 삭제하시겠습니까?")) {
        let data = {
          roomKey: i.roomKey,
        };

        const result = await ApiClient(
          "/lectures/deleteRoom/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.DELETE) {
            window.alert("강의실을 삭제했습니다.");
            router.go(0);
          } else {
            window.alert("삭제를 실패하였습니다.");
            return false;
          }
        }
      }
    };

    const doEdit = async () => {
      if (
        beforeName.value !== roomName.value ||
        beforeTotal.value !== totalPeople.value ||
        beforeType.value !== roomType.value
      ) {
        if (window.confirm("강의실 정보를 수정하시겠습니까?")) {
          let data = {
            roomKey: roomKey.value,
            name: roomName.value,
            type: roomType.value,
            totalPeople: totalPeople.value,
          };

          const result = await ApiClient(
            "/lectures/editRoom/",
            common.makeJson(data)
          );

          if (result) {
            if (result.chunbae === RESULT_KEY.EDIT) {
              window.alert("수정을 완료하였습니다.");
              router.go(0);
            } else {
              window.alert("수정에 실패하였습니다.");
              return false;
            }
          }
        }
      } else {
        window.alert("변경된 내용이 없습니다.");
        return false;
      }
    };

    const selectRoom = (i: roomInterface) => {
      roomInfo.value = i;
    };

    watch(
      () => currentPage.value,
      () => {
        showRoomList.value = roomList.value.slice(
          12 * currentPage.value - 12,
          12 * currentPage.value
        );
      }
    );

    onMounted(async () => {
      category.value = common.findCategory();

      if (common.getItem(KEYS.UK)) {
        if (common.getItem(KEYS.UK).userKey === USER_KEY.KYO_ADM) {
          isKyo.value = true;
        }
      }

      await setRoomList();
    });

    return {
      category,
      isKyo,
      editState,
      showRoomList,
      roomInfo,
      page,
      currentPage,
      typePlaceholder,
      typeList,
      roomName,
      totalPeople,
      roomType,
      selectPage,
      changePage,
      selectRoomType,
      saveRoom,
      editRoom,
      removeRoom,
      doEdit,
      selectRoom,
    };
  },
});
</script>

<template>
  <section class="lecture-detail">
    <div class="lecture-detail">
      <div class="lecture-detail-section">
        <div class="lecture-detail-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="lecture-detail-section-body">
          <div class="lecture-detail-section-body-title">전체 강의실</div>
          <div
            class="lecture-detail-section-body-left"
            style="height: 660px; left: 34px"
          >
            <div class="lecture-detail-section-body-left-list" style="top: 50%">
              <div
                :class="
                  isKyo
                    ? 'lecture-detail-section-body-left-list-item'
                    : 'lecture-detail-section-body-left-list-item-etc'
                "
                v-for="item in showRoomList"
                @click="selectRoom(item)"
              >
                <span class="lecture-name">{{ item.name }}</span>
                <span class="teacher-name"
                  >수용 인원 : {{ item.totalPeople }}명</span
                >
                <span class="target">{{ item.type }}</span>
                <div class="btn" v-if="isKyo">
                  <input
                    type="button"
                    class="btn-edit"
                    value="수정"
                    @click="editRoom(item)"
                  />
                  <input
                    type="button"
                    class="btn-delete"
                    value="삭제"
                    @click="removeRoom(item)"
                  />
                </div>
              </div>
              <div class="lecture-detail-section-body-left-list-page">
                <pagination-component
                  :page="page"
                  :current-page="currentPage"
                  @selectPage="selectPage"
                  @changePage="changePage"
                ></pagination-component>
              </div>
            </div>
          </div>

          <div
            v-if="isKyo"
            class="lecture-detail-section-body-right"
            style="height: 514px"
          >
            <div
              class="lecture-detail-section-body-right-main"
              style="height: 474px"
            >
              <div class="lecture-detail-section-body-right-main-detail">
                <div
                  class="lecture-detail-section-body-right-main-detail-title"
                >
                  강의실 생성하기
                </div>
                <span class="label">강의실 명</span>
                <input
                  type="text"
                  v-model="roomName"
                  placeholder="강의실 명을 입력해주세요."
                />
                <span class="label">총 수용 인원</span>
                <input
                  type="number"
                  v-model="totalPeople"
                  min="1"
                  placeholder="수용 인원을 입력해주세요."
                />
                <span class="label">강의실 유형</span>
                <div class="page">
                  <drop-box-component
                    :placeholder="typePlaceholder"
                    :select-list="typeList"
                    row-height="28px"
                    row-width="240px"
                    @selectValue="selectRoomType"
                  ></drop-box-component>
                </div>
                <input
                  v-if="!editState"
                  type="button"
                  class="save-btn"
                  value="생성하기"
                  @click="saveRoom"
                />
                <input
                  v-if="editState"
                  type="button"
                  class="save-btn"
                  value="수정하기"
                  @click="doEdit"
                />
              </div>
            </div>
          </div>

          <div v-if="!isKyo" class="lecture-detail-section-body-right">
            <div class="lecture-detail-section-body-right-main">
              <div
                class="lecture-detail-section-body-right-main-tip"
                v-if="!roomInfo"
              >
                <span>강의실 상세 열람을</span
                ><span>원하는 강의실 선택해 주세요.</span>
              </div>
              <div
                class="lecture-detail-section-body-right-main-detail"
                v-if="roomInfo"
              >
                <span class="title-label">강의실 상세 조회</span>
                <span class="title-item">{{ roomInfo.name }}</span>
                <div class="sap"></div>
                <span class="label">강의실 유형</span>
                <span class="item">{{ roomInfo.type }}</span>
                <span class="label">총 수용 인원</span>
                <span class="item">{{ roomInfo.totalPeople }} 명</span>
                <span class="label">등록일</span>
                <span class="item">{{
                  roomInfo.createDate.substring(0, 4) +
                  "년 " +
                  roomInfo.createDate.substring(5, 7) +
                  "월 " +
                  roomInfo.createDate.substring(8, 10) +
                  "일"
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
