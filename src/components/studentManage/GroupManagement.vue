<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { defaultInterface, groupInterface } from "../../lib/types";
import common from "../../lib/common";
export default defineComponent({
  name: "GroupManagement",
  setup() {
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const header: defaultInterface[] = [
      { KEY: "NAME", VALUE: "반 이름" },
      { KEY: "TEA", VALUE: "담당 강사" },
    ];
    const testList = ref<Array<groupInterface>>([
      {
        groupKey: "sdfafsd",
        groupName: "test1",
        groupContent: "????",
        endDate: "111111",
        delState: "N",
        createDate: "222222222",
        editDate: "33333",
      },
      {
        groupKey: "sdfafsd",
        groupName: "test2",
        groupContent: "????",
        endDate: "111111",
        delState: "N",
        createDate: "222222222",
        editDate: "33333",
      },
      {
        groupKey: "sdfafsd",
        groupName: "test3",
        groupContent: "????",
        endDate: "111111",
        delState: "N",
        createDate: "222222222",
        editDate: "33333",
      },
      {
        groupKey: "sdfafsd",
        groupName: "test4",
        groupContent: "????",
        endDate: "111111",
        delState: "N",
        createDate: "222222222",
        editDate: "33333",
      },
    ]);

    const getGroupList = async () => {};

    const showGroupDetail = (g: groupInterface) => {};

    onMounted(() => {
      category.value = common.findCategory();
    });
    return {
      category,
      header,
      testList,
      showGroupDetail,
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
                  v-for="item in testList"
                >
                  <td :style="{ width: '35%' }">{{ item.groupName }}</td>
                  <td :style="{ width: '30%' }">김누구</td>
                  <td :style="{ width: '35%' }">
                    <input
                      type="button"
                      value="상세"
                      class="btn-create"
                      @click="showGroupDetail(item)"
                    /><input type="button" value="삭제" class="btn-delete" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
