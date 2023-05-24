<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface, groupInterface } from "../../lib/types";
import common from "../../lib/common";
import { ApiClient } from "../../axios";
import { KEYS, RESULT_KEY } from "../../constant";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "GroupManagement",
  components: { ModalPopupComponent },
  setup() {
    const store = useStore();
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const header: defaultInterface[] = [
      { KEY: "NAME", VALUE: "반 이름" },
      { KEY: "TEA", VALUE: "담당 강사" },
    ];
    const groupList = ref<Array<groupInterface>>([]);
    const groupDetail = ref<groupInterface | undefined>(undefined);
    const editState = ref(false);

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

    const showGroupDetail = (g: groupInterface) => {
      groupDetail.value = g;

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

    onMounted(() => {
      category.value = common.findCategory();

      getGroupList();
    });
    return {
      category,
      header,
      groupList,
      groupDetail,
      editState,
      showGroupDetail,
      deleteGroup,
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
          <div :class="editState ? 'btn-save-active' : 'btn-save'">
            저장하기
          </div>
          <div :class="!editState ? 'btn-edit-active' : 'btn-edit'">
            수정하기
          </div>
        </div>
      </template>
      <template v-slot:body>
        <div class="group-detail">
          <div class="group-detail-left">
            <div class="group-detail-left-name">
              <span class="label">반 이름</span>
              <input type="text" v-if="editState" />
              <div class="item" v-else>{{ groupDetail?.groupName }}</div>
            </div>
            <div class="group-detail-left-teacher">
              <span class="label"> 담당 강사 </span>
              <div class="group-detail-left-teacher-profile"></div>
            </div>
          </div>
          <div class="group-detail-right">
            <div class="group-detail-right-name">
              <span class="label">생성일</span>
              <div class="item">
                {{ groupDetail?.createDate.split("T")[0] }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
