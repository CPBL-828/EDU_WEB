<script lang="ts">
import {
  defineComponent,
  onMounted,
  onUnmounted,
  PropType,
  ref,
  watch,
} from "vue";
import {
  defaultInterface,
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import { CONSTANT, KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import common from "../../lib/common";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { ApiClient } from "../../axios";
/*
@brief [강사, 학생, 학부모] [Main]내 공간 [Sub]내 정보
@props 강사/학생/학부모 중 어떤 유저인지에 대한 키 값, 해당 유저의 정보
 */
export default defineComponent({
  name: "MyInfoComponent",
  components: { ModalPopupComponent },
  props: {
    userKey: {
      type: String as PropType<string>,
      required: true,
    },
    userData: {
      type: Object as PropType<
        studentInterface | parentInterface | teacherInterface
      >,
      required: true,
    },
  },
  setup: function (props) {
    const store = useStore();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const fileURL: string = "http://52.78.111.175:8000/";
    const studentInfo = ref<studentInterface | undefined>(undefined);
    const studentEditInfo = ref<studentInterface>({
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
    const parentInfo = ref<parentInterface | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const teacherEditInfo = ref<teacherInterface>({
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
    const editState = ref(false);
    const resumeState = ref(false);

    const editModal = () => {
      editState.value = false;
      resumeState.value = false;
      store.commit("setModalState", true);
    };

    const resumeModal = () => {
      resumeState.value = true;
      store.commit("setModalState", true);
    };

    const changeEditState = () => {
      editState.value = true;
    };

    const doEdit = async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        let data = {
          teacherKey: teacherInfo.value?.teacherKey,
          email: teacherEditInfo.value.email,
          link: teacherEditInfo.value.link,
          phone: teacherEditInfo.value.phone,
        };

        if (teacherInfo.value?.email !== teacherEditInfo.value.email) {
        } else if (teacherInfo.value?.phone !== teacherEditInfo.value.phone) {
        } else if (teacherInfo.value?.link !== teacherEditInfo.value.link) {
        } else {
          if (
            window.confirm("변경된 사항이 없어요. 수정을 취소하시겠습니까?")
          ) {
            editState.value = false;
            return false;
          }
        }

        const result = await ApiClient(
          "/members/editTeacher/",
          common.makeJson(data)
        );

        if (result.chunbae === RESULT_KEY.EDIT) {
          teacherInfo.value = result.resultData as teacherInterface;
          common.removeItem(KEYS.LU);
          window.alert("정보 수정을 성공했습니다.");
          common.setItem(KEYS.LU, common.makeJson(teacherInfo.value));
          editState.value = false;
        } else {
          window.alert("정보 수정을 실패했습니다.");
        }
      } else {
        let data = {
          studentKey: studentInfo.value?.studentKey,
          phone: studentEditInfo.value.phone,
          address: studentEditInfo.value.address,
        };

        if (studentInfo.value?.phone !== studentEditInfo.value.phone) {
        } else if (studentInfo.value?.school !== studentEditInfo.value.phone) {
        } else if (studentInfo.value?.grade !== studentEditInfo.value.grade) {
        } else if (
          studentInfo.value?.address !== studentEditInfo.value.address
        ) {
        } else {
          if (
            window.confirm("변경된 사항이 없어요. 수정을 취소하시겠습니까?")
          ) {
            editState.value = false;
            return false;
          }
        }

        const result = await ApiClient(
          "/members/editStudent/",
          common.makeJson(data)
        );

        if (result.chunbae === RESULT_KEY.EDIT) {
          studentInfo.value = result.resultData as studentInterface;
          common.removeItem(KEYS.LU);
          window.alert("정보 수정을 성공했습니다.");
          common.setItem(KEYS.LU, common.makeJson(studentInfo.value));
          editState.value = false;
        } else {
          window.alert("정보 수정을 실패했습니다.");
        }
      }
    };

    // const downloadResume = async () => {
    //   if (teacherInfo.value?.resume) {
    //     const resumeUrl = CONSTANT.BASE_URL + teacherInfo.value?.resume;
    //     let element = document.getElementById(
    //       "resume-download"
    //     ) as HTMLAnchorElement;
    //     const filename = `${new Date().toLocaleDateString()}_이력서_${
    //       teacherInfo.value?.name
    //     }.xlsx`;
    //
    //     element.setAttribute("download", filename);
    //     element.href = resumeUrl;
    //
    //     if (
    //       window.confirm(
    //         `${teacherInfo.value?.name} 님의 이력서를 다운로드 하시겠습니까?`
    //       )
    //     ) {
    //       await fetch(resumeUrl);
    //     } else {
    //       return false;
    //     }
    //   } else {
    //     window.alert("저장되어 있는 이력서가 없습니다.");
    //   }
    // };

    const resumeDownload = document.getElementById("resume-download");
    const downloadResume = async () => {
      if (teacherInfo.value?.resume) {
        if (window.confirm("이력서를 다운로드 하시겠습니까?")) {
          const resumeUrl = CONSTANT.BASE_URL + teacherInfo.value?.resume;
          const response = await fetch(resumeUrl);
          if (response.ok) {
            const blob = await response.blob();
            const filename = `${new Date().toLocaleDateString()}_이력서_${
              teacherInfo.value?.name
            }.xlsx`;
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.setAttribute("download", filename);
            link.click();
            URL.revokeObjectURL(link.href);
          }
        } else {
          return false;
        }
      } else {
        window.alert("저장되어 있는 이력서가 없습니다.");
        return false;
      }
    };

    watch(
      () => store.state.modalState,
      () => {
        if (!store.state.modalState) editState.value = false;
      }
    );

    onMounted(() => {
      category.value = common.findCategory();

      if (props.userKey === USER_KEY.PAR) {
        parentInfo.value = props.userData as parentInterface;
      } else if (props.userKey === USER_KEY.STU) {
        studentInfo.value = props.userData as studentInterface;
        studentEditInfo.value.school = studentInfo.value.school;
        studentEditInfo.value.grade = studentInfo.value.grade;
        studentEditInfo.value.address = studentInfo.value.address;
        studentEditInfo.value.phone = studentInfo.value.phone;
      } else if (props.userKey === USER_KEY.TEA) {
        teacherInfo.value = props.userData as teacherInterface;
        teacherEditInfo.value.email = teacherInfo.value.email;
        teacherEditInfo.value.phone = teacherInfo.value.phone;
        teacherEditInfo.value.link = teacherInfo.value.link;
        resumeDownload?.addEventListener("click", downloadResume);
      }
    });

    onUnmounted(() => {
      if (props.userKey === USER_KEY.TEA) {
        resumeDownload?.removeEventListener("click", downloadResume);
      }
    });

    return {
      category,
      fileURL,
      studentInfo,
      studentEditInfo,
      parentInfo,
      teacherInfo,
      teacherEditInfo,
      editState,
      resumeState,
      editModal,
      resumeModal,
      changeEditState,
      doEdit,
      downloadResume,
    };
  },
});
</script>

<template>
  <section class="my-info">
    <div class="my-info">
      <div class="my-info-section">
        <div class="my-info-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="my-info-section-body" v-if="teacherInfo || studentInfo">
          <div class="my-info-section-body-img" v-if="teacherInfo">
            <i class="fa-solid fa-user" v-if="!teacherInfo?.profileImg"></i>
            <img v-else :src="fileURL + teacherInfo.profileImg" alt="profile" />
          </div>
          <div class="my-info-section-body-img" v-if="studentInfo">
            <i class="fa-solid fa-user" v-if="!studentInfo?.profileImg"></i>
            <img
              v-if="studentInfo"
              :src="fileURL + studentInfo.profileImg"
              alt="profile"
            />
          </div>
          <div class="my-info-section-body-content">
            <div
              class="my-info-section-body-content-text"
              v-if="(studentInfo || teacherInfo) && !editState"
            >
              <span class="name" v-if="teacherInfo">
                이름 : {{ teacherInfo.name }} ({{ teacherInfo.id }})
              </span>
              <span class="phone" v-if="teacherInfo">
                연락처 : {{ teacherInfo.phone.substring(0, 3) }}-{{
                  teacherInfo.phone.substring(3, 7)
                }}-{{ teacherInfo.phone.substring(7, 11) }}
              </span>
              <span class="join" v-if="teacherInfo">
                입사일 : {{ teacherInfo.joinDate.substring(0, 4) }}/{{
                  teacherInfo.joinDate.substring(5, 7)
                }}/{{ teacherInfo.joinDate.substring(8, 10) }}
              </span>
              <span class="subject" v-if="teacherInfo">
                담당과목 : {{ teacherInfo.resSubject }}
              </span>
              <span class="part" v-if="teacherInfo">
                담당학년 : {{ teacherInfo.part }}
              </span>

              <span class="name" v-if="studentInfo">
                이름 : {{ studentInfo.name }} ({{ studentInfo.id }})
              </span>
              <span class="part" v-if="studentInfo">
                연락처 : {{ studentInfo.phone.substring(0, 3) }}-{{
                  studentInfo.phone.substring(3, 7)
                }}-{{ studentInfo.phone.substring(7, 11) }}
              </span>
              <span class="join" v-if="studentInfo">
                학교 : {{ studentInfo.school?.slice(0, -3) }}
                {{ studentInfo.grade }}학년
              </span>
            </div>
            <div class="my-info-section-body-content-btn">
              <div
                class="my-info-section-body-content-btn-resume"
                v-if="teacherInfo"
              >
                <div class="down-btn" @click="downloadResume">
                  <a id="resume-download">이력서 받기</a>
                </div>
                <input type="button" class="up-btn" value="업로드" />
              </div>
              <input
                v-if="studentInfo"
                type="button"
                class="view-btn"
                :value="studentInfo ? '세부 정보' : ''"
                @click="editModal"
              />
              <div class="edit-btn" @click="editModal" v-else>
                <i class="fa-solid fa-pen"></i>정보 수정
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      title="상세 정보"
      btn-state="SAVE"
      modal-height="620px"
      modal-width="1078px"
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
        <div class="my-info" v-if="studentInfo">
          <div class="sap"></div>
          <div class="my-info-profile">
            <i class="fa-solid fa-user" v-if="!studentInfo?.profileImg"></i>
            <img :src="fileURL + studentInfo?.profileImg" alt="profile" />
            <i class="fa-solid fa-camera" v-if="editState"></i>
            <input type="file" accept="image/*" v-if="editState" />
            <div class="my-info-profile-name">
              <span>{{ studentInfo?.name }}</span> 학생
            </div>
          </div>
          <div class="my-info-info">
            <div class="my-info-info-content">
              <div class="my-info-info-content-left">
                <div class="name">
                  <span class="name-label">이름</span>
                  <span class="name-item" v-if="!editState">
                    {{ studentInfo?.name }} ({{ studentInfo?.id }})</span
                  >
                  <input
                    v-if="editState"
                    type="text"
                    class="name-item"
                    :disabled="true"
                    :value="studentInfo?.name"
                  />
                </div>
                <div class="part">
                  <span class="part-label">학교</span>
                  <span class="part-item" v-if="!editState"
                    >{{ studentInfo?.school }}
                    {{ studentInfo?.grade }}학년</span
                  >
                  <div class="part-item-edit" v-else>
                    {{ studentInfo?.school }} {{ studentInfo?.grade }}
                  </div>
                </div>
                <div class="email">
                  <span class="email-label">생년월일</span>
                  <span class="email-item" v-if="!editState">{{
                    studentInfo?.birth
                  }}</span>
                  <input
                    v-if="editState"
                    type="text"
                    class="name-item"
                    :disabled="true"
                    :value="studentInfo?.birth"
                  />
                </div>
                <div class="sns">
                  <span class="sns-label">주소</span>
                  <span class="sns-item" v-if="!editState">{{
                    studentInfo?.address
                  }}</span>
                  <input
                    v-if="editState"
                    type="text"
                    class="sns-item"
                    placeholder="주소"
                    v-model="studentEditInfo.address"
                  />
                </div>
              </div>
              <div class="my-info-info-content-right">
                <div class="phone">
                  <span class="phone-label">연락처</span>
                  <span class="phone-item" v-if="!editState">
                    {{ studentInfo?.phone.substring(0, 3) }}-{{
                      studentInfo?.phone.substring(3, 7)
                    }}-{{ studentInfo?.phone.substring(7, 11) }}
                  </span>
                  <input
                    v-if="editState"
                    class="phone-item"
                    type="text"
                    placeholder="연락처"
                    v-model="studentEditInfo.phone"
                  />
                </div>
                <div class="join">
                  <span class="join-label">비상연락망</span>
                  <span class="join-item" v-if="!editState"
                    >{{ studentInfo?.emergency.substring(0, 3) }}-{{
                      studentInfo?.emergency.substring(3, 7)
                    }}-{{ studentInfo?.emergency.substring(7, 11) }}</span
                  >
                  <input
                    v-if="editState"
                    type="text"
                    class="join-item"
                    :disabled="true"
                    :value="studentInfo?.emergency"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="my-info" v-else-if="!resumeState">
          <div class="sap"></div>
          <div class="my-info-profile">
            <i class="fa-solid fa-user" v-if="!teacherInfo?.profileImg"></i>
            <img
              v-else
              :src="fileURL + teacherInfo?.profileImg"
              alt="profile"
            />
            <i class="fa-solid fa-camera" v-if="editState"></i>
            <input type="file" accept="image/*" v-if="editState" />
            <div class="my-info-profile-name">
              <span>{{ teacherInfo?.name }}</span> 강사님
            </div>
          </div>
          <div class="my-info-info">
            <div class="my-info-info-content">
              <div class="my-info-info-content-left">
                <div class="name">
                  <span class="name-label">이름</span>
                  <span class="name-item" v-if="!editState">
                    {{ teacherInfo?.name }} ({{ teacherInfo?.id }})</span
                  >
                  <input
                    v-if="editState"
                    type="text"
                    class="name-item"
                    :disabled="true"
                    :value="teacherInfo?.name"
                  />
                </div>
                <div class="part">
                  <span class="part-label">담당</span>
                  <span class="part-item" v-if="!editState"
                    >{{ teacherInfo?.part }} {{ teacherInfo?.resSubject }}</span
                  >
                  <div class="part-item-edit" v-if="editState">
                    {{ teacherInfo?.part }} {{ teacherInfo?.resSubject }}
                  </div>
                </div>
                <div class="email">
                  <span class="email-label">이메일</span>
                  <span class="email-item" v-if="!editState">{{
                    teacherInfo?.email
                  }}</span>
                  <input
                    v-if="editState"
                    type="text"
                    class="email-item"
                    v-model="teacherEditInfo.email"
                  />
                </div>
                <div class="sns">
                  <span class="sns-label">SNS</span>
                  <span class="sns-item" v-if="!editState"
                    >{{ teacherInfo?.link
                    }}<a :href="teacherInfo?.link" target="_blank"
                      ><i class="fa-solid fa-up-right-from-square"></i></a
                  ></span>
                  <input
                    v-if="editState"
                    type="text"
                    class="sns-item"
                    placeholder="SNS 주소"
                    v-model="teacherEditInfo.link"
                  />
                </div>
              </div>
              <div class="my-info-info-content-right">
                <div class="phone">
                  <span class="phone-label">연락처</span>
                  <span class="phone-item" v-if="!editState">
                    {{ teacherInfo?.phone.substring(0, 3) }}-{{
                      teacherInfo?.phone.substring(3, 7)
                    }}-{{ teacherInfo?.phone.substring(7, 11) }}
                  </span>
                  <input
                    v-if="editState"
                    class="phone-item"
                    type="text"
                    v-model="teacherEditInfo.phone"
                  />
                </div>
                <div class="join">
                  <span class="join-label">입사일</span>
                  <span class="join-item" v-if="!editState"
                    >{{ teacherInfo?.joinDate.substring(0, 4) }}.
                    {{ teacherInfo?.joinDate.substring(5, 7) }}.
                    {{ teacherInfo?.joinDate.substring(8, 10) }}</span
                  >
                  <input
                    v-if="editState"
                    type="text"
                    class="join-item"
                    :disabled="true"
                    :value="teacherInfo?.joinDate"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
