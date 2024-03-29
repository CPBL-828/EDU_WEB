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
    const groupHeader: defaultInterface[] = [
      { KEY: "NAME", VALUE: "반 이름" },
      { KEY: "TEA", VALUE: "담당 강사" },
    ];
    const groupList = ref<Array<groupInterface>>([]);
    const insertGroupDetail = ref<groupInterface>({
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
    const studentState = ref(false);
    const groupStudentList = ref<Array<studentInterface>>([]);
    const selectedStudentList = ref<Array<studentInterface>>([]);
    const selectedStudentDetail = ref([
      {
        groupKey: "",
        studentKey: "",
      },
    ]);
    const groupDetail = ref<groupInterface | undefined>(undefined);
    const teacherDetail = ref<teacherInterface | undefined>(undefined);
    const editState = ref(false);
    const editGroupDetail = ref<groupInterface>({
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

    const getGroupStatusList = async () => {
      let data = {
        groupKey: groupDetail.value?.groupKey,
      };

      const result = await ApiClient(
        "/lectures/getGroupStatusListList/",
        common.makeJson(data)
      );

      if (result) {
        groupStudentList.value = result.resultData as studentInterface[];

        if (result.count > 0) {
          studentState.value = true;
        }
      }
    };

    const getStudentList = async () => {
      let data = {
        userKey: "",
        search: searchStudent.value,
        lectureKey: "",
        parentKey: "",
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

      teacherList.value = [];

      if (result) {
        if (result.count > 0) {
          result.resultData.map((t: teacherInterface) => {
            teacherList.value.push({ KEY: t.teacherKey, VALUE: t.name });
          });
        }
      }
    };

    const getTeacherDetail = async (teacher: string) => {
      let data = {
        teacherKey: teacher,
      };

      const result = await ApiClient(
        "/members/getTeacherDetail/",
        common.makeJson(data)
      );

      if (result) {
        if (createState.value) {
          selectedTeacher.value = result.resultData[0] as teacherInterface;
          insertGroupDetail.value.teacherKey_id =
            selectedTeacher.value.teacherKey;
        } else {
          teacherDetail.value = result.resultData[0] as teacherInterface;
        }
      }
    };

    const goPutStudent = async () => {
      if (
        window.confirm(
          `${groupDetail.value!.groupName} 반의 학생을 배정하시겠습니까?`
        )
      ) {
        await getGroupStatusList();
        selectedStudentList.value = groupStudentList.value;

        await getStudentList();
        store.commit("setModalState", false);
        createState.value = true;
        moreState.value = true;
      } else {
        return false;
      }
    };

    const addStudent = (student: studentInterface) => {
      for (let i = 0; i < studentList.value.length; i++) {
        if (studentList.value[i].studentKey === student.studentKey) {
          studentList.value.splice(i, 1);
          i--;
        }
      }
      selectedStudentList.value.push(student);
    };

    const removeStudent = (student: studentInterface) => {
      for (let i = 0; i < selectedStudentList.value.length; i++) {
        if (selectedStudentList.value[i].studentKey === student.studentKey) {
          selectedStudentList.value.splice(i, 1);
          studentList.value.unshift(student);
          i--;
        }
      }
    };

    const setGroupStatus = async () => {
      selectedStudentList.value.map((s: studentInterface) => {
        selectedStudentDetail.value.push({
          groupKey: groupDetail.value!.groupKey,
          studentKey: s.studentKey,
        });
      });
      selectedStudentDetail.value.splice(0, 1);

      if (studentState.value) {
        const result = await ApiClient(
          "/lectures/editGroupStatus/",
          common.makeJson(selectedStudentDetail.value)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
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
      } else {
        const result = await ApiClient(
          "/lectures/createGroupStatus/",
          common.makeJson(selectedStudentDetail.value)
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
      }
    };

    const showGroupDetail = async (group: groupInterface) => {
      groupDetail.value = group;
      await getGroupStatusList();
      await getTeacherDetail(group.teacherKey_id);

      store.commit("setModalState", true);
    };

    const deleteGroup = async (key: string) => {
      if (
        window.confirm(
          "반을 삭제하면 삭제된 반 목록에서만 확인할 수 있으며,\n반으로써의 효력이 사라집니다.\n정말 삭제하시겠습니까?"
        )
      ) {
        let data = {
          groupKey: key,
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

    const goBack = () => {
      router.go(0);
    };

    const changeMode = async (page: number) => {
      if (page === 0) {
        await setTeacherList();
        createState.value = true;
      } else if (page === 1) {
        await createGroup(1);
      }
    };

    const createGroup = async (mode: number) => {
      if (!insertGroupDetail.value.groupName) {
        window.alert("반 이름을 입력해 주세요.");
        return false;
      } else if (!insertGroupDetail.value.groupContent) {
        window.alert("반 설명을 입력해 주세요.");
        return false;
      } else if (!insertGroupDetail.value.teacherKey_id) {
        window.alert("담당 강사님을 선택해 주세요.");
        return false;
      }

      if (window.confirm("입력하신 정보로 반을 생성하시겠습니까?")) {
        let data = {
          teacherKey: insertGroupDetail.value.teacherKey_id,
          groupName: insertGroupDetail.value.groupName,
          groupContent: insertGroupDetail.value.groupContent,
        };

        const result = await ApiClient(
          "/lectures/createGroup/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.CREATE) {
            await getGroupList();
            window.alert("반을 성공적으로 생성했습니다.");

            if (!mode) {
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
        editGroupDetail.value.groupKey = groupDetail.value.groupKey;
        editGroupDetail.value.teacherKey_id = groupDetail.value.teacherKey_id;
        editGroupDetail.value.groupName = groupDetail.value.groupName;
        editGroupDetail.value.groupContent = groupDetail.value.groupContent;
      }

      editState.value = true;
    };

    const selectTeacher = (teacher: defaultInterface) => {
      if (!createState.value) {
        editGroupDetail.value.teacherKey_id = teacher.KEY;
      }

      getTeacherDetail(teacher.KEY);
    };

    const editGroup = async () => {
      if (
        groupDetail.value?.groupName === editGroupDetail.value.groupName &&
        groupDetail.value?.teacherKey_id === teacherDetail.value?.teacherKey &&
        groupDetail.value?.groupContent === editGroupDetail.value.groupContent
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
          groupKey: editGroupDetail.value.groupKey,
          teacherKey: editGroupDetail.value.teacherKey_id,
          groupName: editGroupDetail.value.groupName,
          groupContent: editGroupDetail.value.groupContent,
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
      groupHeader,
      groupList,
      insertGroupDetail,
      selectedTeacher,
      searchStudent,
      studentList,
      groupStudentList,
      selectedStudentList,
      groupDetail,
      teacherDetail,
      editState,
      editGroupDetail,
      teacherList,
      deleteGroup,
      goBack,
      changeMode,
      createGroup,
      getStudentList,
      goPutStudent,
      addStudent,
      removeStudent,
      setGroupStatus,
      showGroupDetail,
      changeEditState,
      selectTeacher,
      editGroup,
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
            @click="setGroupStatus"
          />
          <div class="group-section-body-list" v-if="!createState">
            <table>
              <thead>
                <tr>
                  <th v-for="item in groupHeader">
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
              <span class="back-btn" @click="goBack">뒤로 가기</span>
              <div class="group-section-body-insert-first-left">
                <div class="group-section-body-insert-first-left-container">
                  <div
                    class="group-section-body-insert-first-left-container-name"
                  >
                    <span class="label">반 이름</span>
                    <input
                      type="text"
                      v-model="insertGroupDetail.groupName"
                      maxlength="50"
                    />
                  </div>
                  <div
                    class="group-section-body-insert-first-left-container-content"
                  >
                    <span class="label">반 설명</span>
                    <textarea v-model="insertGroupDetail.groupContent" />
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
                <div class="group-section-body-insert-more-before-groupHeader">
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
                <div class="group-section-body-insert-more-after-groupHeader">
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
            @click="editGroup"
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
                  v-model="editGroupDetail.groupName"
                  maxlength="50"
                />
                <div class="item" v-else>{{ groupDetail?.groupName }}</div>
              </div>
              <div class="group-detail-left-container-content">
                <span class="label">반 설명</span>
                <input
                  type="text"
                  v-if="editState"
                  v-model="editGroupDetail.groupContent"
                />
                <div class="item" v-else>{{ groupDetail?.groupContent }}</div>
              </div>
              <div class="group-detail-left-container-teacher">
                <span class="label"> 담당 강사 </span>
                <div
                  class="group-detail-left-container-teacher-profile"
                  v-if="teacherDetail"
                >
                  <img
                    v-if="teacherDetail.profileImg"
                    :src="fileURL + teacherDetail.profileImg"
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
                    <span class="item-name">{{ teacherDetail.name }}</span>
                    <span class="label">담당</span>
                    <span class="item-subject"
                      >{{ teacherDetail.part }}
                      {{ teacherDetail.resSubject }}</span
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
                <div class="group-detail-right-container-student-groupHeader">
                  <span class="label"> 배정 학생 </span>
                  <input
                    type="button"
                    value="배정하기"
                    class="btn-put"
                    @click="goPutStudent"
                  />
                </div>
                <div class="group-detail-right-container-student-list">
                  <div
                    class="group-detail-right-container-student-list-item"
                    v-for="item in groupStudentList"
                  >
                    <img
                      v-if="item.profileImg"
                      :src="fileURL + item.profileImg"
                      alt="profile"
                    />
                    <div
                      class="group-detail-right-container-student-list-item-img"
                      v-else
                    >
                      <i class="fa-solid fa-user"></i>
                    </div>
                    <span class="name">{{ item.name }}</span>
                    <span class="school">{{ item.school }}</span>
                    <span class="grade">{{ item.grade }}학년</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
