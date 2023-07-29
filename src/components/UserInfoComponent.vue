<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import CardListComponent from "./custom/CardListComponent.vue";
import {
  adminInterface,
  defaultInterface,
  groupInterface,
  parentInterface,
  scheduleInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import common from "../lib/common";
import { CONSTANT, KEYS, RESULT_KEY, USER_KEY } from "../constant";
import { ApiClient, FileClient } from "../axios";
import DropBoxComponent from "./custom/DropBoxComponent.vue";
import ModalPopupComponent from "./custom/ModalPopupComponent.vue";
import SelectButtonComponent from "./custom/SelectButtonComponent.vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default defineComponent({
  name: "UserInfoComponent",
  props: {
    viewUser: {
      types: String as PropType<string>,
      required: true,
    },
  },
  components: {
    SelectButtonComponent,
    ModalPopupComponent,
    DropBoxComponent,
    CardListComponent,
  },
  setup(props) {
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const loginUser = ref<teacherInterface | adminInterface | undefined>(
      undefined
    );
    const teacherKey = ref<string>("");
    const adminState = ref(false);
    const userKey = ref<string | undefined>(undefined);
    const userDetail = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);
    const total = ref<string | undefined>(undefined);
    const search = ref<string | undefined>(undefined);
    const searchData = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);
    const lectureList = ref<Array<defaultInterface>>([]);
    const lectureKey = ref<string>("");
    const createMode = ref<string | undefined>(undefined);
    const parentList = ref<Array<parentInterface> | undefined>(undefined);
    const searchParentName = ref<string>("");
    const parentDetail = ref<parentInterface>({
      parentKey: "",
      name: "",
      id: "",
      phone: "",
      createDate: "",
      editDate: "",
    });
    const selectedParent = ref(false);
    const gradeList: defaultInterface[] = [
      { KEY: "elementary", VALUE: "초등" },
      { KEY: "middle", VALUE: "중등" },
      { KEY: "high", VALUE: "고등" },
      { KEY: "repeat", VALUE: "재수" },
      { KEY: "essay", VALUE: "논술면접" },
      { KEY: "entrance", VALUE: "입시지도" },
      { KEY: "overseas", VALUE: "해외" },
      { KEY: "characterization", VALUE: "특성화" },
    ];
    const subjectList: defaultInterface[] = [
      { KEY: "KOR", VALUE: "국어" },
      { KEY: "ENG", VALUE: "영어" },
      { KEY: "MATH", VALUE: "수학" },
      { KEY: "HISTORY", VALUE: "한국사" },
      { KEY: "RESEARCH", VALUE: "탐구" },
      { KEY: "CHARACTER", VALUE: "특성화" },
      { KEY: "ESSAY", VALUE: "논술" },
      { KEY: "DEPRECIATION", VALUE: "경시" },
      { KEY: "SAT", VALUE: "SAT" },
      { KEY: "ACT", VALUE: "ACT" },
      { KEY: "AP", VALUE: "AP" },
    ];
    const birthNum = ref<string | undefined>(undefined);
    const createStudentDetail = ref({
      parentKey: "",
      name: "",
      birth: "",
      sex: "",
      phone: "",
      emergency: "",
      school: "",
      grade: "",
      address: "",
      remark: "",
      delState: "N",
    });
    const teacherLevel = ref<string | undefined>(undefined);
    const teacherGrade = ref<number | undefined>(undefined);
    const createTeacherDetail = ref({
      name: "",
      phone: "",
      email: "",
      link: "",
      part: "",
      resSubject: "",
      joinDate: "",
    });
    const groupDetail = ref<Array<groupInterface> | undefined>(undefined);
    const editState = ref(false);
    const filePreview = ref<Blob | null>(null);
    const profileURL = ref<string>("");

    const getUserList = async () => {
      let data = {
        userKey: "",
        search: "",
        parentKey: "",
      };

      if (search.value) {
        data = Object.assign(data, { search: search.value });
      }
      if (common.getItem(KEYS.UK).userKey.slice(-3) !== USER_KEY.ADM) {
        data = Object.assign(data, {
          userKey: teacherKey.value,
          lectureKey: lectureKey.value,
        });
      } else {
        data = Object.assign(data, {
          userKey: "",
          lectureKey: lectureKey.value,
        });
      }

      if (props.viewUser === USER_KEY.STU) {
        data = Object.assign(data, { lectureKey: lectureKey.value });

        const result = await ApiClient(
          "/members/getStudentList/",
          common.makeJson(data)
        );

        if (result) {
          console.log(result);
          userDetail.value = [];

          if (result.count > 0) {
            userDetail.value = result.resultData as studentInterface[];
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
          userDetail.value = [];

          if (result.count > 0) {
            userDetail.value = result.resultData as teacherInterface[];
            total.value = result.count;
          } else {
            if (search.value) {
              window.alert("검색 내용을 찾을 수 없어요.");
            }
          }
        }
      }
    };

    const getLectureList = async () => {
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
            if (item.progress === "등록") {
              lectureList.value.push({
                KEY: item.lectureKey,
                VALUE: item.lectureName,
              });
            }
          });
        }
      }
    };

    const getGroupList = async (
      t: string,
      u: studentInterface | teacherInterface
    ) => {
      let data = {
        userType: t,
        teacherKey:
          t === USER_KEY.TEA ? (u as teacherInterface).teacherKey : "",
        studentKey:
          t === USER_KEY.STU ? (u as studentInterface).studentKey : "",
      };

      const result = await ApiClient(
        "/lectures/getGroupList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          groupDetail.value = result.resultData as groupInterface[];
        } else {
          groupDetail.value = undefined;
        }
      }
    };

    const getParentList = async () => {
      let data = { search: searchParentName.value };

      const result = await ApiClient(
        "/members/getParentList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          parentList.value = result.resultData;
        }
      }
    };

    const selectLecture = async (lecture: defaultInterface) => {
      lectureKey.value = lecture.KEY;
      await getUserList();
    };

    const removeFilter = () => {
      router.go(0);
    };

    const changeCreateMode = async (user: string) => {
      if (user === USER_KEY.STU) {
        await getParentList();
      }

      profileURL.value = "";
      createMode.value = user;
    };

    const selectGrade = (level: defaultInterface) => {
      teacherLevel.value = level.VALUE as string;
    };

    const selectSubject = (subject: defaultInterface) => {
      createTeacherDetail.value.resSubject = subject.VALUE as string;
    };

    const selectParent = (parent: parentInterface) => {
      parentDetail.value = parent;
      createStudentDetail.value.parentKey = parent.parentKey;
      createStudentDetail.value.emergency = parent.phone;
      selectedParent.value = true;
    };

    const createParent = async () => {
      if (!parentDetail.value.name) {
        window.alert("학부모 이름을 작성해 주세요.");
        return false;
      } else if (!parentDetail.value.phone) {
        window.alert("학부모 연락처를 작성해 주세요.");
        return false;
      }

      if (
        window.confirm(
          "학부모 정보를 저장하고, 학생 정보 입력 단계로 넘어가시겠습니까?\n이후 학부모 정보 수정은 불가합니다."
        )
      ) {
        let data = {
          name: parentDetail.value.name,
          phone: parentDetail.value.phone,
        };

        const result = await ApiClient(
          "/members/createParent/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.CREATE) {
            window.alert(
              "학부모 정보를 성공적으로 저장하였습니다.\n학생 정보 입력 단계로 넘어갑니다."
            );
            parentDetail.value = result.resultData;
            createStudentDetail.value.parentKey = result.resultData.parentKey;
            createStudentDetail.value.emergency = result.resultData.phone;

            selectedParent.value = true;
          }
        }
      }
    };

    const createStudent = async () => {
      if (!createStudentDetail.value.name) {
        window.alert("학생명을 입력해주세요.");
        return false;
      } else if (!createStudentDetail.value.phone) {
        window.alert("연락처를 입력해주세요.");
        return false;
      } else if (!createStudentDetail.value.address) {
        window.alert("주소를 입력해주세요.");
        return false;
      } else if (!createStudentDetail.value.school) {
        if (
          !window.confirm(
            "학생의 학교 정보가 입력되지 않았습니다.\n재학 중인 학교 정보가 존재하지 않는 것이 확실한가요?"
          )
        ) {
          return false;
        }
      }

      if (!birthNum.value) {
        window.alert("주민번호를 입력해주세요.");
      } else {
        if (birthNum.value.length > 9 || birthNum.value.length < 9) {
          window.alert(
            "생년월일 값이 올바르지 않습니다.\n주민번호 뒷자리 첫 번째 숫자까지 총 9자리를 입력해주세요."
          );
          return false;
        } else {
          createStudentDetail.value.birth = new Date(
            birthNum.value.substring(0, 4) +
              "-" +
              birthNum.value.substring(4, 6) +
              "-" +
              birthNum.value.substring(6, 8)
          )
            .toISOString()
            .substring(0, 10);

          createStudentDetail.value.sex =
            Number(birthNum.value.substring(-1)) % 2 === 0 ? "여" : "남";
        }
      }

      const result = await ApiClient(
        "/members/createStudent/",
        common.makeJson(createStudentDetail.value)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          if (profileURL.value) {
            studentDetail.value = result.resultData as studentInterface;

            await editUserProfile(USER_KEY.STU, "profile-img-insert");
          }

          window.alert(
            "학생을 성공적으로 등록했습니다.\n" +
              result.resultData.name +
              " (" +
              result.resultData.id +
              ")"
          );
          router.go(0);
        } else {
          window.alert("학생 등록에 실패했습니다.");
        }
      }
    };

    const createTeacher = async () => {
      if (!createTeacherDetail.value.name) {
        window.alert("강사명을 입력해주세요.");
        return false;
      } else if (!createTeacherDetail.value.phone) {
        window.alert("연락처를 입력해주세요.");
        return false;
      } else if (!createTeacherDetail.value.email) {
        window.alert("이메일을 입력해주세요.");
        return false;
      } else if (!createTeacherDetail.value.link) {
        window.alert("개인 SNS 링크를 입력해주세요.");
        return false;
      } else if (!createTeacherDetail.value.resSubject) {
        window.alert("담당 과목을 선택해주세요.");
        return false;
      }

      if (teacherGrade.value && teacherLevel.value) {
        createTeacherDetail.value.part =
          teacherLevel.value + teacherGrade.value;
      } else if (!teacherLevel.value) {
        window.alert("담당 학급을 선택해주세요.");
        return false;
      } else if (!teacherGrade.value) {
        window.alert("담당 학년을 선택해주세요.");
        return false;
      }

      const result = await ApiClient(
        "/members/createTeacher/",
        common.makeJson(createTeacherDetail.value)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          window.alert("강사 정보가 저장되었습니다.");
          router.go(0);
        }
      } else {
        window.alert(
          "강사 정보를 저장하지 못했습니다.\n입력 값을 다시 확인해주세요."
        );
        return false;
      }
    };

    const store = useStore();
    const studentDetail = ref<studentInterface | undefined>(undefined);
    const editStudentDetail = ref<studentInterface>({
      studentKey: "",
      parentKey: "",
      name: "",
      id: "",
      birth: "",
      sex: "",
      phone: "",
      emergency: "",
      school: "",
      grade: "",
      address: "",
      remark: "",
      delState: "",
      profileImg: "",
      createDate: "",
      editDate: "",
    });

    const showStudentDetail = async (student: studentInterface) => {
      studentDetail.value = student;
      await getGroupList(USER_KEY.STU, student);
      editStudentDetail.value.studentKey = student.studentKey;
      editStudentDetail.value.phone = student.phone;
      editStudentDetail.value.school = student.school;
      editStudentDetail.value.grade = student.grade;
      editStudentDetail.value.address = student.address;
      editStudentDetail.value.remark = student.remark;

      if (studentDetail.value.profileImg) {
        profileURL.value = CONSTANT.FILE_URL + studentDetail.value.profileImg;
      } else {
        profileURL.value = "";
      }

      store.commit("setModalState", true);
    };

    const teacherDetail = ref<teacherInterface | undefined>(undefined);
    const editTeacherDetail = ref<teacherInterface>({
      teacherKey: "",
      name: "",
      id: "",
      phone: "",
      email: "",
      part: "",
      resSubject: "",
      joinDate: "",
      leaveDate: "",
      resume: "",
      profileImg: "",
      link: "",
      createDate: "",
      editDate: "",
    });

    const showTeacherDetail = async (teacher: teacherInterface) => {
      teacherDetail.value = teacher;
      await getGroupList(USER_KEY.TEA, teacher);
      editTeacherDetail.value.teacherKey = teacher.teacherKey;
      editTeacherDetail.value.phone = teacher.phone;
      editTeacherDetail.value.email = teacher.email;
      editTeacherDetail.value.link = teacher.link;

      if (teacherDetail.value.profileImg) {
        profileURL.value = CONSTANT.FILE_URL + teacherDetail.value.profileImg;
      } else {
        profileURL.value = "";
      }

      store.commit("setModalState", true);
    };

    const changeEditState = () => {
      editState.value = true;
    };

    const changeProfile = (event: Event) => {
      const v = event.target as HTMLInputElement;
      filePreview.value = URL.createObjectURL(v.files![0]) as unknown as Blob;
      profileURL.value = filePreview.value as unknown as string;
    };

    const editUserProfile = async (user: string, input: string) => {
      const profileData = ref<FormData>(new FormData());
      const photoFile: HTMLInputElement = document.getElementById(
        input
      ) as HTMLInputElement;
      const maxSize = 3 * 1024 * 1024;

      if (photoFile.files) {
        if (photoFile.files[0].size > maxSize) {
          window.alert("파일 사이즈는 3MB 이하로 등록 가능합니다.");
          editState.value = false;
          return false;
        }
        if (user === USER_KEY.STU) {
          profileData.value.append(
            "studentKey",
            studentDetail.value?.studentKey as string
          );
        } else {
          profileData.value.append(
            "teacherKey",
            teacherDetail.value?.teacherKey as string
          );
        }
        profileData.value.append("profileImg", photoFile.files[0]);
      }

      if (user === USER_KEY.STU) {
        const result = await FileClient(
          "/members/editStudentProfile/",
          profileData.value
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            studentDetail.value = result.resultData as studentInterface;
            window.alert("사진을 성공적으로 저장했습니다.");
            profileURL.value =
              CONSTANT.BASE_URL + studentDetail.value.profileImg;
            editState.value = false;
          }
        } else {
          window.alert("프로필 이미지를 저장하는 데 실패했습니다.");
          return false;
        }
      } else {
        const result = await FileClient(
          "/members/editTeacherProfile/",
          profileData.value
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            teacherDetail.value = result.resultData as teacherInterface;
            window.alert("사진을 성공적으로 수정했습니다.");
            profileURL.value =
              CONSTANT.BASE_URL + teacherDetail.value.profileImg;
            editState.value = false;
          }
        } else {
          window.alert("프로필 이미지를 수정하는 데 실패했습니다.");
          return false;
        }
      }
    };

    const editUser = async () => {
      let data = {};

      if (editStudentDetail.value.studentKey) {
        Object.assign(data, {
          studentKey: editStudentDetail.value.studentKey,
          phone: editStudentDetail.value.phone,
          school: editStudentDetail.value.school,
          grade: editStudentDetail.value.grade,
          address: editStudentDetail.value.address,
          remark: editStudentDetail.value.remark,
        });

        if (studentDetail.value?.school !== editStudentDetail.value.school) {
        } else if (
          studentDetail.value?.phone !== editStudentDetail.value.phone
        ) {
        } else if (
          studentDetail.value?.grade !== editStudentDetail.value.grade
        ) {
        } else if (
          studentDetail.value?.address !== editStudentDetail.value.address
        ) {
        } else if (
          studentDetail.value?.remark !== editStudentDetail.value.remark
        ) {
        } else {
          if (
            window.confirm("변경된 사항이 없어요. 수정을 취소하시겠습니까?")
          ) {
            editState.value = false;
            return false;
          } else {
            return false;
          }
        }

        const result = await ApiClient(
          "/members/editStudent/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            studentDetail.value = result.resultData as studentInterface;
            common.removeItem(KEYS.LU);
            window.alert("정보 수정을 성공했습니다.");
            common.setItem(KEYS.LU, common.makeJson(studentDetail.value));
            editState.value = false;
          } else {
            window.alert("정보 수정을 실패했습니다.");
          }
        }
      } else {
        Object.assign(data, {
          teacherKey: editTeacherDetail.value.teacherKey,
          phone: editTeacherDetail.value.phone,
          email: editTeacherDetail.value.email,
          link: editTeacherDetail.value.link,
        });

        if (teacherDetail.value?.email !== editTeacherDetail.value.email) {
        } else if (
          teacherDetail.value?.phone !== editTeacherDetail.value.phone
        ) {
        } else if (teacherDetail.value?.link !== editTeacherDetail.value.link) {
        } else {
          if (
            window.confirm("변경된 사항이 없어요. 수정을 취소하시겠습니까?")
          ) {
            editState.value = false;
            return false;
          } else {
            return false;
          }
        }

        const result = await ApiClient(
          "/members/editTeacher/",
          common.makeJson(data)
        );

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            teacherDetail.value = result.resultData as teacherInterface;
            common.removeItem(KEYS.LU);
            window.alert("정보 수정을 성공했습니다.");
            common.setItem(KEYS.LU, common.makeJson(teacherDetail.value));
            editState.value = false;
          }
        } else {
          window.alert("정보 수정을 실패했습니다.");
        }
      }
    };

    const deleteUser = async () => {
      if (window.confirm("정말 삭제하시겠습니까?")) {
        if (studentDetail.value) {
          let data = {
            studentKey: studentDetail.value?.studentKey,
          };

          const result = await ApiClient(
            "/members/deleteStudent/",
            common.makeJson(data)
          );

          if (result) {
            if (result.chunbae === RESULT_KEY.DELETE) {
              window.alert("성공적으로 삭제했습니다.");
              router.go(0);
            }
          } else {
            window.alert("삭제를 실패했습니다.");
          }
        } else {
          let data = {
            teacherKey: teacherDetail.value?.teacherKey,
          };

          const result = await ApiClient(
            "/members/deleteTeacher/",
            common.makeJson(data)
          );

          if (result) {
            if (result.chunbae === RESULT_KEY.DELETE) {
              window.alert("성공적으로 삭제했습니다.");
              router.go(0);
            }
          } else {
            window.alert("삭제를 실패했습니다.");
          }
        }
      } else {
        return false;
      }
    };

    const deleteUserProfile = async (user: string) => {
      let data = new FormData();

      if (user === USER_KEY.STU) {
        data.append("studentKey", studentDetail.value?.studentKey as string);

        const result = await FileClient("/members/editStudentProfile/", data);

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            studentDetail.value = result.resultData as studentInterface;
            window.alert("프로필 이미지를 정상적으로 삭제했습니다.");
            profileURL.value = "";
            editState.value = false;
          }
        }
      } else {
        data.append("teacherKey", teacherDetail.value?.teacherKey as string);

        const result = await FileClient("/members/editTeacherProfile/", data);

        if (result) {
          if (result.chunbae === RESULT_KEY.EDIT) {
            teacherDetail.value = result.resultData as teacherInterface;
            window.alert("프로필 이미지를 정상적으로 삭제했습니다.");
            profileURL.value = "";
            editState.value = false;
          }
        }
      }
    };

    onMounted(async () => {
      category.value = common.findCategory();
      userKey.value = common.getItem(KEYS.UK).userKey;

      if (common.getItem(KEYS.LU)) {
        if (userKey.value === USER_KEY.TEA) {
          loginUser.value = common.getItem(KEYS.LU) as teacherInterface;
          teacherKey.value = common.getItem(KEYS.LU).teacherKey;
        } else if (userKey.value === USER_KEY.KYO_ADM) {
          adminState.value = true;
          loginUser.value = common.getItem(KEYS.LU) as adminInterface;
        }
      }

      await getUserList();
      await getLectureList();
    });

    return {
      category,
      teacherKey,
      adminState,
      userKey,
      userDetail,
      total,
      search,
      searchData,
      lectureList,
      createMode,
      parentList,
      searchParentName,
      parentDetail,
      selectedParent,
      gradeList,
      teacherGrade,
      subjectList,
      birthNum,
      createStudentDetail,
      createTeacherDetail,
      groupDetail,
      editState,
      getUserList,
      getParentList,
      selectLecture,
      removeFilter,
      changeEditState,
      editUser,
      deleteUser,
      changeCreateMode,
      selectGrade,
      selectSubject,
      selectParent,
      createParent,
      createStudent,
      createTeacher,
      // 모달 옮기는 중
      studentDetail,
      editStudentDetail,
      profileURL,
      showStudentDetail,
      changeProfile,
      editUserProfile,
      teacherDetail,
      editTeacherDetail,
      showTeacherDetail,
      deleteUserProfile,
    };
  },
});
</script>

<template>
  <section class="user-info" v-if="!createMode">
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
        <!-- 학생 정보-->
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
              v-if="adminState"
              @click="changeCreateMode('STU')"
            />
            <i class="fa-solid fa-rotate-left" @click="removeFilter"></i>
          </div>
          <span v-if="total" class="total">학생 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userDetail && viewUser"
            :view-user="viewUser"
            :user-list="userDetail"
            @showStudentDetail="showStudentDetail"
          ></card-list-component>
          <span v-if="!userDetail" class="total"
            >등록된 학생 정보가 없습니다.</span
          >
        </div>

        <!-- 강사 정보-->
        <div class="user-info-section-body" v-else>
          <div class="filter">
            <div class="filter-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                v-model="search"
                placeholder="강사명, 담당 학년, 담당 과목 검색"
                @keypress.enter="getUserList"
              />
            </div>
            <div class="sap"></div>
            <input
              type="button"
              value="생성하기"
              class="filter-create-btn"
              @click="changeCreateMode('TEA')"
            />
          </div>
          <span v-if="total" class="total">강사 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userDetail && viewUser"
            :view-user="viewUser"
            :user-list="userDetail"
            @showTeacherDetail="showTeacherDetail"
          ></card-list-component>
          <span v-if="!userDetail" class="total">
            등록된 강사 정보가 없습니다.
          </span>
        </div>
      </div>
    </div>

    <modal-popup-component
      :title="studentDetail ? '학생 정보 상세 조회' : '강사 정보 상세 조회'"
      modal-height="620px"
      modal-width="1078px"
    >
      <template v-slot:button>
        <div class="btn">
          <div
            :class="editState ? 'btn-save-active' : 'btn-save'"
            @click="editUser"
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
        <span class="del-btn" @click="deleteUser" v-if="adminState"
          >{{ teacherDetail ? "강사" : "학생" }} 정보 삭제하기</span
        >
        <span class="tip">특이사항을 열람하려면 아래로 스크롤 하세요.</span>
        <div class="user">
          <div class="user-detail">
            <div class="user-detail-profile" v-if="studentDetail">
              <div class="user-detail-profile-name">
                <span>{{ studentDetail?.name }}</span> 학생
              </div>
              <div :style="{ position: 'relative' }">
                <i
                  class="fa-solid fa-xmark"
                  @click="deleteUserProfile('STU')"
                  v-if="editState && profileURL"
                ></i>
                <img
                  v-if="profileURL"
                  :src="profileURL"
                  alt="stu-profile"
                  class="user-detail-profile-img"
                  id="profile-img"
                />
              </div>
              <i class="fa-solid fa-user" v-if="!studentDetail?.profileImg"></i>
              <form>
                <input
                  type="file"
                  id="profile-img-edit"
                  accept="image/*"
                  @change="editUserProfile('STU', 'profile-img-edit')"
                  :style="{ bottom: '110px', zIndex: 10 }"
                  v-if="editState"
                />
              </form>
              <i class="fa-solid fa-camera" v-if="editState"></i>
              <div class="user-detail-profile-group" v-if="groupDetail">
                <div class="label">반</div>
                <div class="item">
                  <span v-for="item in groupDetail">{{ item.groupName }}</span>
                </div>
              </div>
            </div>
            <div class="user-detail-profile" v-if="teacherDetail">
              <div class="user-detail-profile-name">
                <span>{{ teacherDetail?.name }}</span> 강사님
              </div>
              <div :style="{ position: 'relative' }">
                <i
                  class="fa-solid fa-xmark"
                  @click="deleteUserProfile('TEA')"
                  v-if="editState && profileURL"
                ></i>
                <img
                  v-if="profileURL"
                  :src="profileURL"
                  alt="stu-profile"
                  class="user-detail-profile-img"
                  id="profile-img"
                />
              </div>
              <i class="fa-solid fa-user" v-if="!teacherDetail?.profileImg"></i>
              <form>
                <input
                  type="file"
                  id="profile-img-edit"
                  accept="image/*"
                  @change="editUserProfile('TEA', 'profile-img-edit')"
                  :style="{ bottom: '110px', zIndex: 10 }"
                  v-if="editState"
                />
              </form>
              <i class="fa-solid fa-camera" v-if="editState"></i>
              <div class="user-detail-profile-group" v-if="groupDetail">
                <div class="label">반</div>
                <div class="item">
                  <span v-for="item in groupDetail">{{ item.groupName }}</span>
                </div>
              </div>
            </div>
            <div class="sap"></div>
            <div class="user-detail-info">
              <div class="user-detail-info-content">
                <div class="user-detail-info-content-left" v-if="studentDetail">
                  <!--              학생 -->
                  <div class="name">
                    <span class="name-label">이름(아이디)</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="name-item"
                      :disabled="true"
                      :value="studentDetail?.name"
                    />
                    <span class="name-item" v-else
                      >{{ studentDetail?.name }} ({{ studentDetail?.id }})</span
                    >
                  </div>
                  <div class="part">
                    <span class="part-label">생년월일</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="name-item"
                      :disabled="true"
                      :value="studentDetail?.birth"
                    />
                    <span class="part-item" v-else>{{
                      studentDetail?.birth
                    }}</span>
                  </div>
                  <div class="email">
                    <span class="email-label">학교</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="email-item"
                      :placeholder="studentDetail?.school"
                      v-model="editStudentDetail.school"
                    />
                    <span class="email-item" v-else>{{
                      studentDetail?.school
                    }}</span>
                  </div>
                  <div class="sns">
                    <span class="sns-label">주소</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="sns-item"
                      :placeholder="studentDetail?.address"
                      v-model="editStudentDetail.address"
                    />
                    <span class="sns-item" v-else>{{
                      studentDetail?.address
                    }}</span>
                  </div>
                </div>
                <!--              강사 -->
                <div class="user-detail-info-content-left" v-if="teacherDetail">
                  <div class="name">
                    <span class="name-label">이름(아이디)</span>
                    <span class="name-item" v-if="!editState"
                      >{{ teacherDetail?.name }} ({{ teacherDetail?.id }})</span
                    >
                    <input
                      v-else
                      type="text"
                      class="name-item"
                      :disabled="true"
                      :value="teacherDetail?.name"
                    />
                  </div>
                  <div class="part">
                    <span class="part-label">담당</span>
                    <span class="part-item" v-if="!editState"
                      >{{ teacherDetail?.part }}
                      {{ teacherDetail?.resSubject }}</span
                    >
                    <div
                      v-else
                      :style="{
                        display: 'flex',
                        justifyContent: 'space-between',
                      }"
                    >
                      <input
                        type="text"
                        class="part-item"
                        :disabled="true"
                        :value="teacherDetail?.part"
                      />
                      <input
                        type="text"
                        class="part-item"
                        :disabled="true"
                        :value="teacherDetail?.resSubject"
                      />
                    </div>
                  </div>
                  <div class="email">
                    <span class="email-label">이메일</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="name-item"
                      :placeholder="teacherDetail?.email"
                      v-model="editTeacherDetail.email"
                    />
                    <span class="email-item" v-else>{{
                      teacherDetail?.email
                    }}</span>
                  </div>
                  <div class="sns">
                    <span class="sns-label">SNS</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="sns-item"
                      :placeholder="teacherDetail?.link"
                      v-model="editTeacherDetail.link"
                    />
                    <span class="sns-item" v-else>{{
                      teacherDetail?.link
                    }}</span>
                  </div>
                </div>
                <div
                  class="user-detail-info-content-right"
                  v-if="studentDetail"
                >
                  <div class="phone">
                    <span class="phone-label">연락처</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="name-item"
                      :placeholder="studentDetail.phone"
                      v-model="editStudentDetail.phone"
                    />
                    <span class="phone-item" v-else>
                      {{ studentDetail?.phone.substring(0, 3) }}-{{
                        studentDetail?.phone.substring(3, 7)
                      }}-{{ studentDetail?.phone.substring(7, 11) }}
                    </span>
                  </div>
                  <div class="join">
                    <span class="join-label">학년</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="name-item"
                      :placeholder="studentDetail?.grade"
                      v-model="editStudentDetail.grade"
                    />
                    <span class="name-item" v-else
                      >{{ studentDetail?.grade }} 학년</span
                    >
                  </div>
                </div>
                <div
                  class="user-detail-info-content-right"
                  v-if="teacherDetail"
                >
                  <div class="phone">
                    <span class="phone-label">연락처</span>
                    <input
                      type="text"
                      v-if="editState"
                      class="name-item"
                      :placeholder="teacherDetail.phone"
                      v-model="editTeacherDetail.phone"
                    />
                    <span class="phone-item" v-else>
                      {{ teacherDetail?.phone.substring(0, 3) }}-{{
                        teacherDetail?.phone.substring(3, 7)
                      }}-{{ teacherDetail?.phone.substring(7, 11) }}
                    </span>
                  </div>
                  <div class="join">
                    <span class="join-label">입사일</span>
                    <span class="join-item" v-if="!editState"
                      >{{ teacherDetail?.joinDate.substring(0, 4) }}.
                      {{ teacherDetail?.joinDate.substring(5, 7) }}.
                      {{ teacherDetail?.joinDate.substring(8, 10) }}</span
                    >
                    <input
                      v-else
                      type="text"
                      class="name-item"
                      :disabled="true"
                      :value="teacherDetail?.joinDate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="user-remark" v-if="studentDetail">
            <span class="label">특이사항</span>
            <div class="user-remark-content" v-if="!editState">
              {{
                studentDetail?.remark
                  ? studentDetail?.remark
                  : "작성된 특이사항이 없습니다."
              }}
            </div>
            <textarea
              v-else
              :placeholder="studentDetail?.remark"
              class="user-remark-content"
              v-model="editStudentDetail.remark"
            />

            <div class="user-remark-btn">
              <input
                type="button"
                value="분석 내용 열람하러 가기"
                class="go-analysis"
              />
              <input type="button" value="성적 열람하러 가기" class="go-test" />
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>

  <section class="student-insert" v-else>
    <div class="student-insert">
      <div class="student-insert-section">
        <div class="student-insert-section-tag">
          {{ createMode === "STU" ? "학생 생성" : "강사 생성" }}
        </div>
        <div class="student-insert-section-body" v-if="createMode === 'STU'">
          <span class="back" @click="$router.go(0)">목록으로 돌아가기</span>
          <input
            v-if="selectedParent"
            type="button"
            class="insert-btn"
            value="저장하기"
            @click="createStudent"
          />

          <!-- 학부모 입력-->
          <div
            class="student-insert-section-body-parent"
            v-if="!selectedParent"
          >
            <div class="student-insert-section-body-parent-new">
              <span class="tip">기존 학부모 정보가 존재하지 않나요?</span>
              <div class="student-insert-section-body-parent-new-input">
                <span class="label">이름</span>
                <input
                  type="text"
                  placeholder="이름"
                  v-model="parentDetail.name"
                />
                <span class="label">연락처</span>
                <input
                  type="text"
                  placeholder="번호 11자리"
                  v-model="parentDetail.phone"
                />
              </div>
              <input
                type="button"
                value="저장하고 다음 단계로"
                class="student-insert-section-body-parent-new-save"
                @click="createParent"
              />
            </div>
            <div class="sap"></div>
            <div class="student-insert-section-body-parent-existed">
              <span class="tip">기존 학부모 정보가 존재하나요?</span>
              <div
                class="student-insert-section-body-parent-existed-search"
                @keypress.enter="getParentList"
              >
                <input
                  type="text"
                  class="parent-name"
                  placeholder="학부모명 검색"
                  v-model="searchParentName"
                />
                <i
                  class="fa-solid fa-magnifying-glass"
                  @click="getParentList"
                ></i>
              </div>
              <div class="student-insert-section-body-parent-existed-list">
                <table>
                  <thead>
                    <tr>
                      <th>이름 (아이디)</th>
                      <th>연락처</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="item in parentList" @click="selectParent(item)">
                      <td>{{ item.name }} ({{ item.id }})</td>
                      <td>
                        {{ item.phone.substring(0, 3) }} - **** -
                        {{ item.phone.substring(7, 12) }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- 학생 입력-->
          <div class="student-insert-section-body-container" v-else>
            <div class="student-insert-section-body-container-profile">
              <div v-if="!profileURL">
                <span>증명사진을</span>
                <span>첨부해주세요.</span>
              </div>
              <img v-else :src="profileURL" alt="profile-prev" />
              <i class="fa-solid fa-camera"></i>
              <form>
                <input
                  type="file"
                  @change="changeProfile"
                  id="profile-img-insert"
                />
              </form>
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-name">
                <span>이름 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="이름"
                  v-model="createStudentDetail.name"
                />
              </div>

              <div class="student-insert-section-body-container-info-birth">
                <span
                  >생년월일 8자리 + 주민번호 뒷자리 첫 번째
                  <span class="red">(필수)</span></span
                >
                <div>
                  <input
                    type="text"
                    placeholder="YYYYMMDDN"
                    v-model="birthNum"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-phone">
                <span>연락처 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="'-' 없이 번호만 입력"
                  v-model="createStudentDetail.phone"
                />
              </div>
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-school">
                <span>학적 정보 <span class="red">(재학 시 필수)</span></span>
                <div>
                  <input
                    type="text"
                    class="input-school"
                    placeholder="학교명"
                    v-model="createStudentDetail.school"
                  />
                  <input
                    type="number"
                    class="input-grade"
                    placeholder="학년"
                    min="1"
                    max="6"
                    v-model="createStudentDetail.grade"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-address">
                <span>거주지 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="주소"
                  v-model="createStudentDetail.address"
                />
              </div>

              <div class="student-insert-section-body-container-info-remark">
                <span>특이사항</span>
                <textarea
                  placeholder="특이사항"
                  class="input-remark"
                  v-model="createStudentDetail.remark"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 강사 입력-->
        <div class="student-insert-section-body" v-if="createMode === 'TEA'">
          <span class="back" @click="$router.go(0)">목록으로 돌아가기</span>
          <input
            type="button"
            class="insert-btn"
            value="저장하기"
            @click="createTeacher"
          />
          <span class="info-tip"> 모든 정보를 반드시 기입해 주세요. </span>
          <div class="student-insert-section-body-container">
            <div class="student-insert-section-body-container-profile">
              <span>증명사진을</span>
              <span>첨부해주세요.</span>
              <i class="fa-solid fa-camera"></i>
              <input type="file" />
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-name">
                <span>이름</span>
                <input
                  type="text"
                  placeholder="이름"
                  v-model="createTeacherDetail.name"
                />
              </div>

              <div class="student-insert-section-body-container-info-phone">
                <span>연락처</span>
                <input
                  type="text"
                  placeholder="'-' 없이 번호만 입력"
                  v-model="createTeacherDetail.phone"
                />
              </div>

              <div class="student-insert-section-body-container-info-school">
                <span>담당</span>
                <div>
                  <div
                    class="student-insert-section-body-container-info-school-drop"
                  >
                    <drop-box-component
                      :select-list="gradeList"
                      placeholder="학급"
                      row-width="100px"
                      row-height="40px"
                      @selectValue="selectGrade"
                    ></drop-box-component>

                    <input
                      type="number"
                      class="input-grade"
                      placeholder="학년"
                      min="1"
                      max="6"
                      :style="{
                        color: '#565656',
                      }"
                      v-model="teacherGrade"
                    />

                    <drop-box-component
                      :select-list="subjectList"
                      placeholder="과목"
                      row-width="70px"
                      row-height="40px"
                      @selectValue="selectSubject"
                    ></drop-box-component>
                  </div>
                </div>
              </div>
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-email">
                <span>이메일</span>
                <div>
                  <input
                    type="text"
                    placeholder="이메일"
                    v-model="createTeacherDetail.email"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-email">
                <span>SNS</span>
                <div>
                  <input
                    type="text"
                    placeholder="SNS 링크"
                    v-model="createTeacherDetail.link"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-address">
                <span>입사일</span>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  v-model="createTeacherDetail.joinDate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
