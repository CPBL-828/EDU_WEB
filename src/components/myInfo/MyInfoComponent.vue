<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import { KEYS, USER_KEY } from "../../constant";
import common from "../../lib/common";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
import { ApiClient } from "../../axios";
/*
@brief 강사, 학생, 학부모의 내 정보 표시
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
    const studentInfo = ref<studentInterface | undefined>(undefined);
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

    const editModal = () => {
      editState.value = false;
      store.commit("setModalState", true);
    };

    const changeEditState = () => {
      editState.value = true;
    };

    const doEdit = async () => {
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
        if (window.confirm("변경된 사항이 없어요. 수정을 취소하시겠습니까?"))
          editState.value = false;
      }

      const result = await ApiClient(
        "/members/editTeacher/",
        common.makeJson(data)
      );

      if (result) {
        teacherInfo.value = result as teacherInterface;
        common.removeItem(KEYS.LU);
        window.alert("정보 수정을 성공했습니다.");
        common.setItem(KEYS.LU, common.makeJson(teacherInfo.value));
        editState.value = false;
      } else {
        window.alert("정보 수정을 실패했습니다.");
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
      } else if (props.userKey === USER_KEY.TEA) {
        teacherInfo.value = props.userData as teacherInterface;
        teacherEditInfo.value.email = teacherInfo.value.email;
        teacherEditInfo.value.phone = teacherInfo.value.phone;
        teacherEditInfo.value.link = teacherInfo.value.link;
      }
    });

    return {
      category,
      studentInfo,
      parentInfo,
      teacherInfo,
      teacherEditInfo,
      editState,
      editModal,
      changeEditState,
      doEdit,
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
          <div class="my-info-section-body-img">
            <i class="fa-solid fa-camera"></i>
            <i
              class="fa-solid fa-user"
              v-if="!teacherInfo?.profileImg || !studentInfo?.profileImg"
            ></i>
            <input type="file" accept="image/*" />
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
              <input
                v-if="teacherInfo"
                type="button"
                class="view-btn"
                :value="teacherInfo ? '이력서 보기' : ''"
              />
              <input
                v-if="studentInfo"
                type="button"
                class="view-btn"
                :value="studentInfo ? '세부 정보' : ''"
              />
              <div class="edit-btn" @click="editModal">
                <i class="fa-solid fa-pen"></i>정보 수정
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal-popup-component
      title="강사 상세 정보"
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
        <div v-if="studentInfo">
          <div v-for="item in studentInfo">{{ item }}</div>
        </div>
        <div class="user-detail" v-if="teacherInfo">
          <div class="sap"></div>
          <div class="user-detail-profile">
            <i class="fa-solid fa-user" v-if="!teacherInfo?.profileImg"></i>
            <i class="fa-solid fa-camera" v-if="editState"></i>
            <input type="file" accept="image/*" v-if="editState" />
            <div class="user-detail-profile-name">
              <span>{{ teacherInfo?.name }}</span> 강사님
            </div>
          </div>
          <div class="user-detail-info">
            <div class="user-detail-info-content">
              <div class="user-detail-info-content-left">
                <div class="name">
                  <span class="name-label">이름</span>
                  <span class="name-item" v-if="!editState">{{
                    teacherInfo?.name
                  }}</span>
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
              <div class="user-detail-info-content-right">
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
