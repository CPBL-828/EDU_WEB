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
  groupInterface,
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import { CONSTANT, KEYS, RESULT_KEY, USER_KEY } from "../../constant";
import common from "../../lib/common";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { ApiClient, FileClient } from "../../axios";
import { useRouter } from "vue-router";

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
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const fileURL: string = "http://52.78.111.175:8000";
    const studentDetail = ref<studentInterface | undefined>(undefined);
    const studentEditDetail = ref<studentInterface>({
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
    const parentDetail = ref<parentInterface | undefined>(undefined);
    const teacherDetail = ref<teacherInterface | undefined>(undefined);
    const teacherEditDetail = ref<teacherInterface>({
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
    const groupList = ref<Array<groupInterface> | undefined>(undefined);
    const editState = ref(false);
    const resumeState = ref(false);

    const getGroupList = async () => {
      const userType: string = common.getItem(KEYS.UK).userKey;

      let data = {
        userType: userType,
        teacherKey:
          userType === USER_KEY.TEA ? common.getItem(KEYS.LU).teacherKey : "",
        studentKey:
          userType === USER_KEY.STU ? common.getItem(KEYS.LU).studentKey : "",
      };

      const result = await ApiClient(
        "/lectures/getGroupList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          groupList.value = result.resultData as groupInterface[];
        }
      }
    };

    const showEditModal = async () => {
      editState.value = false;
      resumeState.value = false;
      await getGroupList();
      store.commit("setModalState", true);
    };

    const showResumeModal = () => {
      resumeState.value = true;
      store.commit("setModalState", true);
    };

    const changeEditState = () => {
      editState.value = true;
    };

    const doEdit = async () => {
      if (common.getItem(KEYS.UK).userKey === USER_KEY.TEA) {
        let data = {
          teacherKey: teacherDetail.value?.teacherKey,
          email: teacherEditDetail.value.email,
          link: teacherEditDetail.value.link,
          phone: teacherEditDetail.value.phone,
        };

        if (teacherDetail.value?.email !== teacherEditDetail.value.email) {
        } else if (
          teacherDetail.value?.phone !== teacherEditDetail.value.phone
        ) {
        } else if (teacherDetail.value?.link !== teacherEditDetail.value.link) {
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
          teacherDetail.value = result.resultData as teacherInterface;
          common.removeItem(KEYS.LU);
          window.alert("정보 수정을 성공했습니다.");
          common.setItem(KEYS.LU, common.makeJson(teacherDetail.value));
          editState.value = false;
        } else {
          window.alert("정보 수정을 실패했습니다.");
        }
      } else {
        let data = {
          studentKey: studentDetail.value?.studentKey,
          phone: studentEditDetail.value.phone,
          address: studentEditDetail.value.address,
        };

        if (studentDetail.value?.phone !== studentEditDetail.value.phone) {
        } else if (
          studentDetail.value?.school !== studentEditDetail.value.phone
        ) {
        } else if (
          studentDetail.value?.grade !== studentEditDetail.value.grade
        ) {
        } else if (
          studentDetail.value?.address !== studentEditDetail.value.address
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
          studentDetail.value = result.resultData as studentInterface;
          common.removeItem(KEYS.LU);
          window.alert("정보 수정을 성공했습니다.");
          common.setItem(KEYS.LU, common.makeJson(studentDetail.value));
          editState.value = false;
        } else {
          window.alert("정보 수정을 실패했습니다.");
        }
      }
    };

    const editTeacherResume = async () => {
      const resumeData = ref<FormData>(new FormData());
      const resumeFile: HTMLInputElement = document.getElementById(
        "resume-upload"
      ) as HTMLInputElement;

      if (resumeFile.files) {
        resumeData.value.append(
          "teacherKey",
          teacherDetail.value?.teacherKey as string
        );
        resumeData.value.append("resume", resumeFile.files[0]);
      }

      const result = await FileClient(
        "/members/editTeacherResume/",
        resumeData.value
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.EDIT) {
          common.removeItem(KEYS.LU);
          common.setItem(KEYS.LU, common.makeJson(result.resultData));
          window.alert("이력서를 성공적으로 업로드 하였습니다.");
          router.go(0);
        }
      } else {
        window.alert("이력서 업로드에 실패하였습니다.");
      }
    };

    const resumeDownload = document.getElementById("resume-download");
    const downloadResume = async () => {
      if (teacherDetail.value?.resume) {
        if (window.confirm("이력서를 다운로드 하시겠습니까?")) {
          const resumeUrl = CONSTANT.BASE_URL + teacherDetail.value?.resume;
          const response = await fetch(resumeUrl);
          if (response.ok) {
            const blob = await response.blob();
            const filename = `${new Date().toLocaleDateString()}_이력서_${
              teacherDetail.value?.name
            }`;
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
        parentDetail.value = props.userData as parentInterface;
      } else if (props.userKey === USER_KEY.STU) {
        studentDetail.value = props.userData as studentInterface;
        studentEditDetail.value.school = studentDetail.value.school;
        studentEditDetail.value.grade = studentDetail.value.grade;
        studentEditDetail.value.address = studentDetail.value.address;
        studentEditDetail.value.phone = studentDetail.value.phone;
      } else if (props.userKey === USER_KEY.TEA) {
        teacherDetail.value = props.userData as teacherInterface;
        teacherEditDetail.value.email = teacherDetail.value.email;
        teacherEditDetail.value.phone = teacherDetail.value.phone;
        teacherEditDetail.value.link = teacherDetail.value.link;
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
      studentDetail,
      studentEditDetail,
      parentDetail,
      teacherDetail,
      teacherEditDetail,
      groupList,
      editState,
      resumeState,
      showEditModal,
      showResumeModal,
      changeEditState,
      doEdit,
      editTeacherResume,
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
        <div
          class="my-info-section-body"
          v-if="teacherDetail || studentDetail || parentDetail"
        >
          <div class="my-info-section-body-img" v-if="teacherDetail">
            <i class="fa-solid fa-user" v-if="!teacherDetail?.profileImg"></i>
            <img
              v-else
              :src="fileURL + teacherDetail.profileImg"
              alt="profile"
            />
          </div>
          <div class="my-info-section-body-img" v-else-if="studentDetail">
            <i class="fa-solid fa-user" v-if="!studentDetail?.profileImg"></i>
            <img
              v-else
              :src="fileURL + studentDetail.profileImg"
              alt="profile"
            />
          </div>
          <div class="my-info-section-body-img" v-else-if="parentDetail">
            <i class="fa-solid fa-user"></i>
          </div>
          <div class="my-info-section-body-content">
            <div
              class="my-info-section-body-content-text"
              v-if="teacherDetail && !editState"
            >
              <span class="name">
                이름 : {{ teacherDetail?.name }} ({{ teacherDetail?.id }})
              </span>
              <span class="phone">
                연락처 : {{ teacherDetail?.phone.substring(0, 3) }}-{{
                  teacherDetail?.phone.substring(3, 7)
                }}-{{ teacherDetail?.phone.substring(7, 11) }}
              </span>
              <span class="join">
                입사일 : {{ teacherDetail?.joinDate.substring(0, 4) }}/{{
                  teacherDetail?.joinDate.substring(5, 7)
                }}/{{ teacherDetail?.joinDate.substring(8, 10) }}
              </span>
              <span class="subject">
                담당과목 : {{ teacherDetail?.resSubject }}
              </span>
              <span class="part"> 담당학년 : {{ teacherDetail?.part }} </span>
            </div>

            <div
              class="my-info-section-body-content-text"
              v-if="studentDetail && !editState"
            >
              <span class="name">
                이름 : {{ studentDetail?.name }} ({{ studentDetail?.id }})
              </span>
              <span class="part">
                연락처 : {{ studentDetail?.phone.substring(0, 3) }}-{{
                  studentDetail?.phone.substring(3, 7)
                }}-{{ studentDetail?.phone.substring(7, 11) }}
              </span>
              <span class="join">
                학교 : {{ studentDetail?.school?.slice(0, -3) }}
                {{ studentDetail?.grade }}학년
              </span>
            </div>

            <div
              class="my-info-section-body-content-text"
              v-if="parentDetail && !editState"
            >
              <span class="name">
                이름 : {{ parentDetail?.name }} ({{ parentDetail?.id }})
              </span>
              <span class="part">
                연락처 : {{ parentDetail?.phone.substring(0, 3) }}-{{
                  parentDetail?.phone.substring(3, 7)
                }}-{{ parentDetail?.phone.substring(7, 11) }}
              </span>
            </div>
            <div class="my-info-section-body-content-btn">
              <div
                class="my-info-section-body-content-btn-resume"
                v-if="teacherDetail"
              >
                <div class="down-btn" @click="downloadResume">
                  <a id="resume-download">이력서 받기</a>
                </div>
                <label for="resume-upload" class="up-btn">첨부하기</label>
                <form>
                  <input
                    id="resume-upload"
                    accept="application/msword, application/pdf, .hwp"
                    type="file"
                    @change="editTeacherResume"
                  />
                </form>
              </div>
              <input
                v-if="studentDetail"
                type="button"
                class="view-btn"
                :value="studentDetail ? '세부 정보' : ''"
                @click="showEditModal"
              />
              <div
                class="edit-btn"
                @click="showEditModal"
                v-else-if="!parentDetail"
              >
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
        <div class="my-info" v-if="studentDetail">
          <div class="sap"></div>
          <div class="my-info-profile">
            <div class="my-info-profile-name">
              <span>{{ studentDetail?.name }}</span>
            </div>
            <i class="fa-solid fa-user" v-if="!studentDetail?.profileImg"></i>
            <img
              :src="fileURL + studentDetail?.profileImg"
              alt="profile"
              v-else
            />
            <i class="fa-solid fa-camera" v-if="editState"></i>
            <input
              id="profile-img-edit"
              type="file"
              accept="image/*"
              v-if="editState"
            />
            <div class="group" v-if="groupList">
              <div class="label">반</div>
              <div class="item">
                <span v-for="item in groupList">{{ item.groupName }}</span>
              </div>
            </div>
          </div>
          <div class="my-info-info">
            <div class="my-info-info-content">
              <div class="my-info-info-content-left">
                <div class="name">
                  <span class="name-label">이름</span>
                  <span class="name-item" v-if="!editState">
                    {{ studentDetail?.name }} ({{ studentDetail?.id }})</span
                  >
                  <input
                    v-if="editState"
                    type="text"
                    class="name-item"
                    :disabled="true"
                    :value="studentDetail?.name"
                  />
                </div>
                <div class="part">
                  <span class="part-label">학교</span>
                  <span class="part-item" v-if="!editState"
                    >{{ studentDetail?.school }}
                    {{ studentDetail?.grade }}학년</span
                  >
                  <div class="part-item-edit" v-else>
                    {{ studentDetail?.school }} {{ studentDetail?.grade }}
                  </div>
                </div>
                <div class="email">
                  <span class="email-label">생년월일</span>
                  <span class="email-item" v-if="!editState">{{
                    studentDetail?.birth
                  }}</span>
                  <input
                    v-if="editState"
                    type="text"
                    class="name-item"
                    :disabled="true"
                    :value="studentDetail?.birth"
                  />
                </div>
                <div class="sns">
                  <span class="sns-label">주소</span>
                  <span class="sns-item" v-if="!editState">{{
                    studentDetail?.address
                  }}</span>
                  <input
                    v-if="editState"
                    type="text"
                    class="sns-item"
                    placeholder="주소"
                    v-model="studentEditDetail.address"
                  />
                </div>
              </div>
              <div class="my-info-info-content-right">
                <div class="phone">
                  <span class="phone-label">연락처</span>
                  <span class="phone-item" v-if="!editState">
                    {{ studentDetail?.phone.substring(0, 3) }}-{{
                      studentDetail?.phone.substring(3, 7)
                    }}-{{ studentDetail?.phone.substring(7, 11) }}
                  </span>
                  <input
                    v-if="editState"
                    class="phone-item"
                    type="text"
                    placeholder="연락처"
                    v-model="studentEditDetail.phone"
                  />
                </div>
                <div class="join">
                  <span class="join-label">비상연락망</span>
                  <span class="join-item" v-if="!editState"
                    >{{ studentDetail?.emergency.substring(0, 3) }}-{{
                      studentDetail?.emergency.substring(3, 7)
                    }}-{{ studentDetail?.emergency.substring(7, 11) }}</span
                  >
                  <input
                    v-if="editState"
                    type="text"
                    class="join-item"
                    :disabled="true"
                    :value="studentDetail?.emergency"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="my-info" v-else-if="!resumeState">
          <div class="sap"></div>
          <div class="my-info-profile">
            <div class="my-info-profile-name">
              <span>{{ teacherDetail?.name }}</span> 강사님
            </div>
            <i class="fa-solid fa-user" v-if="!teacherDetail?.profileImg"></i>
            <img
              v-else
              :src="fileURL + teacherDetail?.profileImg"
              alt="profile"
            />
            <i class="fa-solid fa-camera" v-if="editState"></i>
            <input type="file" accept="image/*" v-if="editState" />
            <div class="my-info-profile-group" v-if="groupList">
              <div class="label">반</div>
              <div class="item">
                <span v-for="item in groupList">{{ item.groupName }}</span>
              </div>
            </div>
          </div>
          <div class="my-info-info">
            <div class="my-info-info-content">
              <div class="my-info-info-content-left">
                <div class="name">
                  <span class="name-label">이름</span>
                  <span class="name-item" v-if="!editState">
                    {{ teacherDetail?.name }} ({{ teacherDetail?.id }})</span
                  >
                  <input
                    v-if="editState"
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
                  <div class="part-item-edit" v-if="editState">
                    {{ teacherDetail?.part }} {{ teacherDetail?.resSubject }}
                  </div>
                </div>
                <div class="email">
                  <span class="email-label">이메일</span>
                  <span class="email-item" v-if="!editState">{{
                    teacherDetail?.email
                  }}</span>
                  <input
                    v-if="editState"
                    type="text"
                    class="email-item"
                    v-model="teacherEditDetail.email"
                  />
                </div>
                <div class="sns">
                  <span class="sns-label">SNS</span>
                  <span class="sns-item" v-if="!editState"
                    >{{ teacherDetail?.link
                    }}<a :href="teacherDetail?.link" target="_blank"
                      ><i class="fa-solid fa-up-right-from-square"></i></a
                  ></span>
                  <input
                    v-if="editState"
                    type="text"
                    class="sns-item"
                    placeholder="SNS 주소"
                    v-model="teacherEditDetail.link"
                  />
                </div>
              </div>
              <div class="my-info-info-content-right">
                <div class="phone">
                  <span class="phone-label">연락처</span>
                  <span class="phone-item" v-if="!editState">
                    {{ teacherDetail?.phone.substring(0, 3) }}-{{
                      teacherDetail?.phone.substring(3, 7)
                    }}-{{ teacherDetail?.phone.substring(7, 11) }}
                  </span>
                  <input
                    v-if="editState"
                    class="phone-item"
                    type="text"
                    v-model="teacherEditDetail.phone"
                  />
                </div>
                <div class="join">
                  <span class="join-label">입사일</span>
                  <span class="join-item" v-if="!editState"
                    >{{ teacherDetail?.joinDate.substring(0, 4) }}.
                    {{ teacherDetail?.joinDate.substring(5, 7) }}.
                    {{ teacherDetail?.joinDate.substring(8, 10) }}</span
                  >
                  <input
                    v-if="editState"
                    type="text"
                    class="join-item"
                    :disabled="true"
                    :value="teacherDetail?.joinDate"
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
