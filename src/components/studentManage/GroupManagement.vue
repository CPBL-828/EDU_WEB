<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  defaultInterface,
  groupInterface,
  studentInterface,
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
    const createState = ref(false);
    const moreState = ref(false);
    const header: defaultInterface[] = [
      { KEY: "NAME", VALUE: "반 이름" },
      { KEY: "TEA", VALUE: "담당 강사" },
    ];
    const groupList = ref<Array<groupInterface>>([]);
    const groupInsertData = ref<groupInterface>({
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
    const selectedTeacher = ref<teacherInterface | undefined>(undefined);
    const searchStudent = ref<string>("");
    const studentList = ref<Array<studentInterface>>([]);
    const selectedStudentList = ref<Array<studentInterface>>([]);
    const selectedStudentData = ref([
      {
        groupKey: "",
        studentKey: "",
      },
    ]);
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

    const getStudentList = async () => {
      let data = {
        userKey: "",
        search: searchStudent.value,
        lectureKey: "",
      };

      const result = await ApiClient(
        "/members/getStudentList/",
        common.makeJson(data)
      );

      if (result) {
        studentList.value = result.resultData.filter((s: studentInterface) => {
          return !selectedStudentList.value.some(
            (ss: studentInterface) => ss.studentKey === s.studentKey
          );
        });
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
        if (createState.value) {
          selectedTeacher.value = result.resultData[0] as teacherInterface;
          groupInsertData.value.teacherKey_id =
            selectedTeacher.value.teacherKey;
        } else {
          teacherInfo.value = result.resultData[0] as teacherInterface;
        }
      }
    };

    const goPutStudent = async () => {
      if (
        window.confirm(
          `${groupDetail.value!.groupName} 반의 학생을 배정하시겠습니까?`
        )
      ) {
        await getStudentList();
        store.commit("setModalState", false);
        createState.value = true;
        moreState.value = true;
      } else {
        return false;
      }
    };

    const addStudent = (s: studentInterface) => {
      for (let i = 0; i < studentList.value.length; i++) {
        if (studentList.value[i].studentKey === s.studentKey) {
          studentList.value.splice(i, 1);
          i--;
        }
      }
      selectedStudentList.value.push(s);
    };

    const removeStudent = (s: studentInterface) => {
      for (let i = 0; i < selectedStudentList.value.length; i++) {
        if (selectedStudentList.value[i].studentKey === s.studentKey) {
          selectedStudentList.value.splice(i, 1);
          studentList.value.unshift(s);
          i--;
        }
      }
    };

    const saveGroupStudent = async () => {
      selectedStudentList.value.map((s: studentInterface) => {
        selectedStudentData.value.push({
          groupKey: groupDetail.value!.groupKey,
          studentKey: s.studentKey,
        });
      });
      selectedStudentData.value.splice(0, 1);

      const result = await ApiClient(
        "/lectures/createGroupStatus/",
        common.makeJson(selectedStudentData.value)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          window.alert(
            `${result.resultData.length} 명의 학생을 성공적으로 배정했습니다.`
          );
          router.go(0);
        } else {
          window.alert("학생 배정을 실패했습니다. 다시 시도해 주세요.");
          return false;
        }
      } else {
        window.alert("학생 배정을 실패했습니다. 다시 시도해 주세요.");
        return false;
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

    const changeMode = async (p: number) => {
      if (p === 0) {
        await setTeacherList();
        createState.value = true;
      } else if (p === 1) {
        await createGroup(1);
      }
    };

    const createGroup = async (m: number) => {
      if (!groupInsertData.value.groupName) {
        window.alert("반 이름을 입력해 주세요.");
        return false;
      } else if (!groupInsertData.value.groupContent) {
        window.alert("반 설명을 입력해 주세요.");
        return false;
      } else if (!groupInsertData.value.teacherKey_id) {
        window.alert("담당 강사님을 선택해 주세요.");
        return false;
      }

      if (window.confirm("입력하신 정보로 반을 생성하시겠습니까?")) {
        let data = {
          teacherKey: groupInsertData.value.teacherKey_id,
          groupName: groupInsertData.value.groupName,
          groupContent: groupInsertData.value.groupContent,
        };

        const result = await ApiClient(
          "/lectures/createGroup/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.CREATE) {
            await getGroupList();
            window.alert("반을 성공적으로 생성했습니다.");

            if (!m) {
              router.go(0);
            } else {
              groupDetail.value = result.resultData as groupInterface;
              await getStudentList();
              moreState.value = true;
            }
          } else {
            window.alert("반 생성을 실패했습니다.");
            return false;
          }
        } else {
          window.alert("반 생성을 실패했습니다.");
          return false;
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
      if (!createState.value) {
        groupEditData.value.teacherKey_id = t.KEY;
      }

      getTeacherDetail(t.KEY);
    };

    const doEdit = async () => {
      if (
        groupDetail.value?.groupName === groupEditData.value.groupName &&
        groupDetail.value?.teacherKey_id === teacherInfo.value?.teacherKey &&
        groupDetail.value?.groupContent === groupEditData.value.groupContent
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
      createState,
      moreState,
      header,
      groupList,
      groupInsertData,
      selectedTeacher,
      searchStudent,
      studentList,
      selectedStudentList,
      groupDetail,
      teacherInfo,
      editState,
      groupEditData,
      teacherList,
      deleteGroup,
      changeMode,
      createGroup,
      getStudentList,
      goPutStudent,
      addStudent,
      removeStudent,
      saveGroupStudent,
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
          <input
            v-if="!createState"
            type="button"
            value="생성하기"
            class="btn-create"
            @click="changeMode(0)"
          />
          <input
            v-else-if="moreState"
            type="button"
            value="저장"
            class="save"
            @click="saveGroupStudent"
          />
          <div class="group-section-body-list" v-if="!createState">
            <table>
              <thead>
                <tr>
                  <th v-for="item in header">
                    {{ item.VALUE }}
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in groupList">
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

          <div class="group-section-body-insert" v-else>
            <div class="group-section-body-insert-first" v-if="!moreState">
              <div class="group-section-body-insert-first-left">
                <div class="group-section-body-insert-first-left-container">
                  <div
                    class="group-section-body-insert-first-left-container-name"
                  >
                    <span class="label">반 이름</span>
                    <input
                      type="text"
                      v-model="groupInsertData.groupName"
                      maxlength="50"
                    />
                  </div>
                  <div
                    class="group-section-body-insert-first-left-container-content"
                  >
                    <span class="label">반 설명</span>
                    <textarea v-model="groupInsertData.groupContent" />
                  </div>
                  <div
                    class="group-section-body-insert-first-left-container-teacher"
                  >
                    <span class="label">담당 강사</span>
                    <div
                      class="group-section-body-insert-first-left-container-teacher-profile"
                      v-if="selectedTeacher"
                    >
                      <img
                        v-if="selectedTeacher.profileImg"
                        :src="fileURL + selectedTeacher.profileImg"
                        alt="profile"
                      />
                      <div
                        class="group-section-body-insert-first-left-container-teacher-profile-img"
                        v-else
                      >
                        <i class="fa-solid fa-user"></i>
                      </div>
                      <div
                        class="group-section-body-insert-first-left-container-teacher-profile-info"
                        v-if="selectedTeacher"
                      >
                        <span class="label">강사명</span>
                        <span class="item-name">{{
                          selectedTeacher.name
                        }}</span>
                        <span class="label">담당</span>
                        <span class="item-subject"
                          >{{ selectedTeacher.part }}
                          {{ selectedTeacher.resSubject }}</span
                        >
                      </div>
                    </div>
                  </div>
                  <div
                    class="group-section-body-insert-first-left-container-teacher-drop"
                  >
                    <drop-box-component
                      :select-list="teacherList"
                      placeholder="강사 선택"
                      row-height="40px"
                      row-width="264px"
                      @selectValue="selectTeacher"
                    ></drop-box-component>
                  </div>
                </div>
              </div>
              <div class="group-section-body-insert-first-right">
                <span class="tip">추후에 학생들을 배정할 수 있습니다.</span>
                <input
                  type="button"
                  class="btn-save"
                  value="반 생성하기"
                  @click="createGroup(0)"
                />
                <span class="tip">반을 생성하고 즉시 학생을 배정합니다.</span>
                <input
                  type="button"
                  class="btn-more"
                  value="학생 배정하기"
                  @click="changeMode(1)"
                />
              </div>
            </div>

            <div class="group-section-body-insert-more" v-else>
              <div class="group-section-body-insert-more-before">
                <div class="group-section-body-insert-more-before-header">
                  <span>학생 목록</span>
                  <div class="search">
                    <input
                      type="text"
                      v-model="searchStudent"
                      placeholder="학생명, 학교명 검색"
                      @keypress.enter="getStudentList"
                    />
                    <i
                      class="fa-solid fa-magnifying-glass"
                      @click="getStudentList"
                    ></i>
                  </div>
                </div>
                <div class="group-section-body-insert-more-before-stu">
                  <div
                    class="group-section-body-insert-more-before-stu-item"
                    v-for="item in studentList"
                  >
                    <div
                      class="group-section-body-insert-more-after-stu-item-profile"
                      v-if="!item.profileImg"
                    >
                      <i class="fa-solid fa-user"></i>
                    </div>
                    <img
                      v-if="item.profileImg"
                      :src="fileURL + item.profileImg"
                      alt="profile"
                    />
                    <div
                      class="group-section-body-insert-more-after-stu-item-info"
                    >
                      <span>{{ item.name }}</span>
                      <span>{{ item.school }} {{ item.grade }}</span>
                    </div>
                    <input
                      type="button"
                      value="배정"
                      @click="addStudent(item)"
                    />
                  </div>
                </div>
              </div>
              <div class="group-section-body-insert-more-after">
                <div class="group-section-body-insert-more-after-header">
                  <span class="group">{{ groupDetail?.groupName }} 반</span>
                  <span>배정 목록</span>
                </div>
                <div class="group-section-body-insert-more-after-stu">
                  <div
                    class="group-section-body-insert-more-after-stu-item"
                    v-for="item in selectedStudentList"
                  >
                    <div
                      class="group-section-body-insert-more-after-stu-item-profile"
                      v-if="!item.profileImg"
                    >
                      <i class="fa-solid fa-user"></i>
                    </div>
                    <img
                      v-if="item.profileImg"
                      :src="fileURL + item.profileImg"
                      alt="profile"
                    />
                    <div
                      class="group-section-body-insert-more-after-stu-item-info"
                    >
                      <span>{{ item.name }}</span>
                      <span>{{ item.school }} {{ item.grade }}</span>
                    </div>
                    <input
                      type="button"
                      value="취소"
                      @click="removeStudent(item)"
                    />
                  </div>
                </div>
              </div>
            </div>
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
              <div class="group-detail-left-container-content">
                <span class="label">반 설명</span>
                <input
                  type="text"
                  v-if="editState"
                  v-model="groupEditData.groupContent"
                />
                <div class="item" v-else>{{ groupDetail?.groupContent }}</div>
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
                  <input
                    type="button"
                    value="배정하기"
                    class="btn-put"
                    @click="goPutStudent"
                  />
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
