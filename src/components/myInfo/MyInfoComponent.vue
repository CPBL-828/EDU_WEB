<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import {
  defaultInterface,
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import { USER_KEY } from "../../constant";
import common from "../../lib/common";
import { useStore } from "vuex";
import ModalPopupComponent from "../custom/ModalPopupComponent.vue";
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
    const editState = ref(false);

    const editModal = () => {
      store.commit("setModalState", true);
    };

    const changeEditState = () => {
      editState.value = !editState.value;
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
      }
    });

    return {
      category,
      studentInfo,
      parentInfo,
      teacherInfo,
      editState,
      editModal,
      changeEditState,
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
        <div class="my-info-section-main" v-if="teacherInfo || studentInfo">
          <div class="my-info-section-main-img">
            <i class="fa-solid fa-camera"></i>
            <i
              class="fa-solid fa-user"
              v-if="!teacherInfo?.profileImg || !studentInfo?.profileImg"
            ></i>
            <input type="file" accept="image/*" />
          </div>
          <div class="my-info-section-main-content">
            <div
              class="my-info-section-main-content-text"
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
            <div class="my-info-section-main-content-btn">
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
            :class="editState ? 'btn-save' : 'btn-edit'"
            @click="changeEditState()"
          >
            {{ editState ? "저장하기" : "수정하기" }}
          </div>
        </div>
      </template>
      <template v-slot:body v-if="!editState">
        <div v-if="studentInfo">
          <div v-for="item in studentInfo">{{ item }}</div>
        </div>
        <div class="teacher-section" v-if="teacherInfo">
          <div class="sap"></div>
          <div class="teacher-section-profile">
            <i class="fa-solid fa-user" v-if="!teacherInfo?.profileImg"></i>
            <div class="teacher-section-profile-name">
              <span>{{ teacherInfo?.name }}</span> 강사님
            </div>
          </div>
          <div class="teacher-section-info">
            <div class="teacher-section-info-content">
              <div class="teacher-section-info-content-left">
                <div class="name">
                  <span class="name-label">이름</span>
                  <span class="name-item">{{ teacherInfo?.name }}</span>
                </div>
                <div class="part">
                  <span class="part-label">담당</span>
                  <span class="part-item"
                    >{{ teacherInfo?.part }} {{ teacherInfo?.resSubject }}</span
                  >
                </div>
                <div class="email">
                  <span class="email-label">이메일</span>
                  <span class="email-item">{{ teacherInfo?.email }}</span>
                </div>
                <div class="sns">
                  <span class="sns-label">SNS</span>
                  <span class="sns-item">SNS 주소</span>
                </div>
              </div>
              <div class="teacher-section-info-content-right">
                <div class="phone">
                  <span class="phone-label">연락처</span>
                  <span class="phone-item">
                    {{ teacherInfo?.phone.substring(0, 3) }}-{{
                      teacherInfo?.phone.substring(3, 7)
                    }}-{{ teacherInfo?.phone.substring(7, 11) }}
                  </span>
                </div>
                <div class="join">
                  <span class="join-label">입사일</span>
                  <span class="join-item"
                    >{{ teacherInfo?.joinDate.substring(0, 4) }}.
                    {{ teacherInfo?.joinDate.substring(5, 7) }}.
                    {{ teacherInfo?.joinDate.substring(8, 10) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:body v-if="editState">
        <div v-if="studentInfo">
          <div v-for="item in studentInfo">{{ item }}</div>
        </div>
      </template>
    </modal-popup-component>
  </section>
</template>
