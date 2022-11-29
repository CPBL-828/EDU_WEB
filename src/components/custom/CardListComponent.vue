<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { studentInterface, teacherInterface } from "../../lib/types";
import { USER_KEY } from "../../constant";
import ModalPopupComponent from "./ModalPopupComponent.vue";
import { useStore } from "vuex";
/*
@brief 전체 학생 및 강사의 요약적 정보를 표시할 카드형 리스트
@props 학생과 강사중 보여주고자 하는 유저 값, 해당 유저의 리스트
 */
export default defineComponent({
  name: "CardListComponent",
  components: { ModalPopupComponent },
  props: {
    viewUser: {
      types: String as PropType<string>,
      required: true,
    },
    userList: {
      types: Object as PropType<Array<studentInterface | teacherInterface>>,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const studentInfo = ref<studentInterface | undefined>(undefined);
    const teacherList = ref<Array<teacherInterface> | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);

    const setUserList = () => {
      if (props.viewUser === USER_KEY.STU) {
        studentList.value = props.userList as studentInterface[];
      } else {
        teacherList.value = props.userList as teacherInterface[];
      }
    };

    const openModal = (v: string, i: studentInterface | teacherInterface) => {
      store.state.modalState = true;

      if (v === USER_KEY.STU) {
        studentInfo.value = i as studentInterface;
      } else {
        teacherInfo.value = i as teacherInterface;
      }
    };

    /*
    상위 컴포넌트에서 검색으로 인해 userList에 담긴 값이 변경되면,
    setUserList()를 호출해 현재 컴포넌트의 userList에도 정상적으로 적용되도록 함
     */
    watch(
      () => props.userList,
      () => {
        setUserList();
      }
    );

    onMounted(async () => {
      await setUserList();
    });

    return {
      studentList,
      studentInfo,
      teacherList,
      teacherInfo,
      openModal,
    };
  },
});
</script>

<template>
  <section class="card">
    <div class="card">
      <div v-if="studentList" v-for="item in studentList" class="card-item">
        <div v-if="!item.profileImg" class="card-item-profile">
          <i class="fa-solid fa-user"></i>
        </div>
        <img v-if="item.profileImg" :src="item.profileImg" alt="profile" />
        <div class="card-item-info">
          <div class="card-item-info-name">
            <span class="title">이름</span>
            <span class="name">{{ item.name }}</span>
            <span class="school">{{ item.school }} ({{ item.grade }}학년)</span>
          </div>
          <div class="card-item-info-phone">
            <span class="title">연락처</span>
            <div class="card-item-info-phone-section">
              <div class="card-item-info-phone-section-stu">
                <span class="title">학생</span>
                <span class="number"
                  >{{ item.phone.substring(0, 3) }}-{{
                    item.phone.substring(3, 7)
                  }}-{{ item.phone.substring(7, 11) }}</span
                >
              </div>
              <div class="card-item-info-phone-section-par">
                <span class="title">학부모</span>
                <span class="number">준비 중입니다</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-item-detail" @click="openModal('STU', item)">
          상세 조회
        </div>
      </div>

      <div v-if="teacherList" v-for="item in teacherList" class="card-item">
        <div v-if="!item.profileImg" class="card-item-profile">
          <i class="fa-solid fa-user"></i>
        </div>
        <img v-if="item.profileImg" :src="item.profileImg" alt="profile" />
        <div class="card-item-info">
          <div class="card-item-info-name">
            <span class="title">이름</span>
            <span class="name">{{ item.name }}</span>
            <span class="school">{{ item.part }} {{ item.resSubject }}</span>
          </div>
          <div class="card-item-info-phone">
            <span class="title">연락처</span>
            <div class="card-item-info-phone-section">
              <div class="card-item-info-phone-section-stu">
                <span class="title">phone</span>
                <span class="number"
                  >{{ item.phone.substring(0, 3) }}-{{
                    item.phone.substring(3, 7)
                  }}-{{ item.phone.substring(7, 11) }}</span
                >
              </div>
              <div class="card-item-info-phone-section-par">
                <span class="title">email</span>
                <span class="email">{{ item.email }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-item-detail" @click="openModal('TEA', item)">
          상세 조회
        </div>
      </div>
    </div>
  </section>

  <modal-popup-component
    :title="studentInfo ? '학생 정보 상세 조회' : '강사 정보 상세 조회'"
    modal-height="620px"
    modal-width="1078px"
  >
    <template v-slot:body>
      <div class="user-detail">
        <div class="sap"></div>
        <div class="user-detail-profile">
          <i
            class="fa-solid fa-user"
            v-if="teacherInfo && !teacherInfo?.profileImg"
          ></i>
          <i
            class="fa-solid fa-user"
            v-if="studentInfo && !studentInfo?.profileImg"
          ></i>
          <div v-if="teacherInfo" class="user-detail-profile-name">
            <span>{{ teacherInfo?.name }}</span> 강사님
          </div>
          <div v-if="studentInfo" class="user-detail-profile-name">
            <span>{{ studentInfo?.name }}</span> 학생
          </div>
        </div>
        <div class="user-detail-info">
          <div class="user-detail-info-content">
            <div class="user-detail-info-content-left">
              <div class="name">
                <span class="name-label">이름</span>
                <span class="name-item" v-if="teacherInfo">{{
                  teacherInfo?.name
                }}</span>
                <span class="name-item" v-if="studentInfo">{{
                  studentInfo?.name
                }}</span>
              </div>
              <div class="part" v-if="teacherInfo">
                <span class="part-label">담당</span>
                <span class="part-item"
                  >{{ teacherInfo?.part }} {{ teacherInfo?.resSubject }}</span
                >
              </div>
              <div class="part" v-if="studentInfo">
                <span class="part-label">생년월일</span>
                <span class="part-item">{{ studentInfo?.birth }}</span>
              </div>
              <div class="email" v-if="teacherInfo">
                <span class="email-label">이메일</span>
                <span class="email-item">{{ teacherInfo?.email }}</span>
              </div>
              <div class="email" v-if="studentInfo">
                <span class="email-label">학교</span>
                <span class="email-item">{{ studentInfo?.school }}</span>
              </div>
              <div class="sns" v-if="teacherInfo">
                <span class="sns-label">SNS</span>
                <span class="sns-item">{{ teacherInfo?.link }}</span>
              </div>
              <div class="sns" v-if="studentInfo">
                <span class="sns-label">주소</span>
                <span class="sns-item">{{ studentInfo?.address }}</span>
              </div>
            </div>
            <div class="user-detail-info-content-right">
              <div class="phone">
                <span class="phone-label">연락처</span>
                <span class="phone-item" v-if="teacherInfo">
                  {{ teacherInfo?.phone.substring(0, 3) }}-{{
                    teacherInfo?.phone.substring(3, 7)
                  }}-{{ teacherInfo?.phone.substring(7, 11) }} </span
                ><span class="phone-item" v-if="studentInfo">
                  {{ studentInfo?.phone.substring(0, 3) }}-{{
                    studentInfo?.phone.substring(3, 7)
                  }}-{{ studentInfo?.phone.substring(7, 11) }}
                </span>
              </div>
              <div class="join" v-if="teacherInfo">
                <span class="join-label">입사일</span>
                <span class="join-item"
                  >{{ teacherInfo?.joinDate.substring(0, 4) }}.
                  {{ teacherInfo?.joinDate.substring(5, 7) }}.
                  {{ teacherInfo?.joinDate.substring(8, 10) }}</span
                >
              </div>
              <div class="join" v-if="studentInfo">
                <span class="join-label">학년</span>
                <span class="join-item">{{ studentInfo?.grade }} 학년</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </modal-popup-component>
</template>
