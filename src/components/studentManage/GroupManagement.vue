<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  defaultInterface,
  groupInterface,
  teacherInterface,
} from "../../lib/types";
import common from "../../lib/common";
import { ApiClient } from "../../axios";
import { CONSTANT, KEYS, RESULT_KEY } from "../../constant";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import DropBoxComponent from "../custom/DropBoxComponent.vue";

export default defineComponent({
  name: "GroupManagement",
  components: { DropBoxComponent, ModalPopupComponent },
  setup() {
    const store = useStore();
    const router = useRouter();
    const fileURL: string = CONSTANT.FILE_URL;
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const header: defaultInterface[] = [
      { KEY: "NAME", VALUE: "반 이름" },
      { KEY: "TEA", VALUE: "담당 강사" },
    ];
    const groupList = ref<Array<groupInterface>>([]);
    const groupDetail = ref<groupInterface | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const editState = ref(false);
    const groupEditData = ref<groupInterface>({
      groupKey: "",
      teacherKey_id: "",
      teacherName: "",
      groupName: "",
      groupContent: "",
      endDate: "",
      delState: "",
      createDate: "",
      editDate: "",
    });
    const teacherList = ref<Array<defaultInterface>>([]);

    const getGroupList = async () => {
      let data = {
        userType: common.getItem(KEYS.UK).userKey.slice(-3),
        teacherKey: "",
        studentKey: "",
        groupKey: "",
      };

      const result = await ApiClient(
        "/lectures/getGroupList/",
        common.makeJson(data)
      );

      if (result) {
        groupList.value = [];

        if (result.count > 0) {
          result.resultData.map((group: groupInterface) => {
            if (group.delState === "N") groupList.value.push(group);
          });
        }
      }
    };

    const setTeacherList = async () => {
      let data = {
        search: "",
      };

      const result = await ApiClient(
        "/members/getTeacherList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((t: teacherInterface) => {
            teacherList.value.push({ KEY: t.teacherKey, VALUE: t.name });
          });
        }
      }
    };

    const getTeacherDetail = async (t: string) => {
      let data = {
        teacherKey: t,
      };

      const result = await ApiClient(
        "/members/getTeacherDetail/",
        common.makeJson(data)
      );

      if (result) {
        teacherInfo.value = result.resultData[0] as teacherInterface;
      }
    };

    const showGroupDetail = async (g: groupInterface) => {
      groupDetail.value = g;
      await getTeacherDetail(g.teacherKey_id);

      store.commit("setModalState", true);
    };

    const deleteGroup = async (k: string) => {
      if (
        window.confirm(
          "반을 삭제하면 삭제된 반 목록에서만 확인할 수 있으며,\n반으로써의 효력이 사라집니다.\n정말 삭제하시겠습니까?"
        )
      ) {
        let data = {
          groupKey: k,
        };

        const result = await ApiClient(
          "/lectures/deleteGroup/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.DELETE) {
            window.alert("반을 성공적으로 삭제했습니다.");
            router.go(0);
          } else {
            window.alert("실패했습니다. 다시 시도해 주세요.");
          }
        } else {
          window.alert("실패했습니다. 다시 시도해 주세요.");
        }
      } else {
        return false;
      }
    };

    const changeEditState = async () => {
      await setTeacherList();

      if (groupDetail.value) {
        groupEditData.value.groupKey = groupDetail.value.groupKey;
        groupEditData.value.teacherKey_id = groupDetail.value.teacherKey_id;
        groupEditData.value.groupName = groupDetail.value.groupName;
        groupEditData.value.groupContent = groupDetail.value.groupContent;
      }

      editState.value = true;
    };

    const selectTeacher = (t: defaultInterface) => {
      groupEditData.value.teacherKey_id = t.KEY;
      getTeacherDetail(t.KEY);
    };

    const doEdit = async () => {
      if (
        groupDetail.value?.groupName === groupEditData.value.groupName &&
        groupDetail.value?.teacherKey_id === teacherInfo.value?.teacherKey
      ) {
        if (
          window.confirm("수정된 내용이 없습니다.\n수정을 취소하시겠습니까?")
        ) {
          editState.value = false;
          return false;
        } else {
          return false;
        }
      }

      if (window.confirm("수정한 정보를 저장하시겠습니까?")) {
        let data = {
          groupKey: groupEditData.value.groupKey,
          teacherKey: groupEditData.value.teacherKey_id,
          groupName: groupEditData.value.groupName,
          groupContent: groupEditData.value.groupContent,
        };

        const result = await ApiClient(
          "/lectures/editGroup/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            groupDetail.value = result.resultData as groupInterface;
            window.alert(
              "성공적으로 수정했습니다.\n수정된 목록을 확인하시려면 팝업을 닫고 새로고침을 해주세요."
            );
            editState.value = false;
          } else {
            window.alert("수정을 실패했습니다. 다시 시도해 주세요.");
            return false;
          }
        } else {
          window.alert("수정을 실패했습니다. 다시 시도해 주세요.");
          return false;
        }
      } else {
        return false;
      }
    };

    onMounted(() => {
      category.value = common.findCategory();

      getGroupList();
    });

    return {
      fileURL,
      category,
      header,
      groupList,
      groupDetail,
      teacherInfo,
      editState,
      groupEditData,
      teacherList,
      deleteGroup,
      showGroupDetail,
      changeEditState,
      selectTeacher,
      doEdit,
    };
  },
});
</script>

<template>
  <section class="group">
    <div class="group">
      <div class="group-section">
        <div class="group-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="group-section-body">
          <div class="group-section-body-list">
            <table class="group-section-body-list-table">
              <thead class="group-section-body-list-table-header">
                <tr class="group-section-body-list-table-header-item">
                  <th v-for="item in header">
                    {{ item.VALUE }}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody class="group-section-body-list-table-content">
                <tr
                  class="group-section-body-list-table-content-item"
                  v-for="item in groupList"
                >
                  <td :style="{ width: '35%' }">{{ item.groupName }}</td>
                  <td :style="{ width: '30%' }">{{ item.teacherName }}</td>
                  <td :style="{ width: '35%' }">
                    <input
                      type="button"
                      value="상세"
                      class="btn-create"
                      @click="showGroupDetail(item)"
                    /><input
                      type="button"
                      value="삭제"
                      class="btn-delete"
                      @click="deleteGroup(item.groupKey)"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      title="반 상세"
      modal-width="1078px"
      modal-height="808px"
    >
      <template v-slot:button>
        <div class="btn">
          <div
            :class="editState ? 'btn-save-active' : 'btn-save'"
            @click="doEdit"
          >
            저장하기
          </div>
          <div
            :class="!editState ? 'btn-edit-active' : 'btn-edit'"
            @click="changeEditState"
          >
            수정하기
          </div>
        </div>
      </template>
      <template v-slot:body>
        <div class="group-detail">
          <div class="group-detail-left">
            <div class="group-detail-left-container">
              <div class="group-detail-left-container-name">
                <span class="label">반 이름</span>
                <input
                  type="text"
                  v-if="editState"
                  v-model="groupEditData.groupName"
                  maxlength="50"
                />
                <div class="item" v-else>{{ groupDetail?.groupName }}</div>
              </div>
              <div class="group-detail-left-container-teacher">
                <span class="label"> 담당 강사 </span>
                <div
                  class="group-detail-left-container-teacher-profile"
                  v-if="teacherInfo"
                >
                  <img
                    v-if="teacherInfo.profileImg"
                    :src="fileURL + teacherInfo.profileImg"
                    alt="profile"
                  />
                  <div
                    class="group-detail-left-container-teacher-profile-img"
                    v-else
                  >
                    <i class="fa-solid fa-user"></i>
                  </div>
                  <div class="group-detail-left-container-teacher-profile-info">
                    <span class="label">강사명</span>
                    <span class="item-name">{{ teacherInfo.name }}</span>
                    <span class="label">담당</span>
                    <span class="item-subject"
                      >{{ teacherInfo.part }} {{ teacherInfo.resSubject }}</span
                    >
                  </div>
                </div>
                <div class="group-detail-left-container-teacher-drop">
                  <drop-box-component
                    v-if="editState"
                    :select-list="teacherList"
                    placeholder="강사 선택"
                    row-height="40px"
                    row-width="264px"
                    @selectValue="selectTeacher"
                  ></drop-box-component>
                </div>
              </div>
            </div>
          </div>
          <div class="group-detail-right">
            <div class="group-detail-right-container">
              <div class="group-detail-right-container-name">
                <span class="label">생성일</span>
                <div class="item">
                  {{ groupDetail?.createDate.split("T")[0] }}
                </div>
              </div>
              <div class="group-detail-right-container-student">
                <div class="group-detail-right-container-student-header">
                  <span class="label"> 배정 학생 </span>
                  <input type="button" value="배정하기" class="btn-put" />
                </div>
                <div class="group-detail-right-container-student-list"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
