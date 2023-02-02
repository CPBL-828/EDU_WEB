<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { studentInterface, teacherInterface } from "../../lib/types";
import { KEYS, USER_KEY } from "../../constant";
import ModalPopupComponent from "./ModalPopupComponent.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import common from "../../lib/common";
/*
@brief 전체 학생 및 강사의 요약적 정보를 표시할 카드형 리스트
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
    const router = useRouter();
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

    const openModal = (u: string, i: studentInterface | teacherInterface) => {
      store.state.modalState = true;

      if (u === USER_KEY.STU) {
        studentInfo.value = i as studentInterface;
      } else {
        teacherInfo.value = i as teacherInterface;
      }
    };

    const goOther = (w: string) => {
      store.state.modalState = false;

      if (w === "ANALYSIS") {
        common.removeItem(KEYS.SR);
        common.setItem(KEYS.SR, common.makeJson({ sr: w.toLowerCase() }));
        router.push("/s-manage/analysis");
      } else if (w === "TEST") {
        common.removeItem(KEYS.MR);
        common.removeItem(KEYS.SR);
        common.setItem(KEYS.MR, common.makeJson({ mr: w.toLowerCase() }));
        router.push("/test");
      }
    };

    /*
    상위 컴포넌트에서 검색으로 인해 userList에 담긴 값이 변경되면,
    setUserList()를 호출해 현재 컴포넌트의 userList에도 정상적으로 적용되도록 함
     */
    watch(
      () => props.userList,
      async () => {
        await setUserList();
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
      goOther,
    };
  },
});
</script>

<template>
  <section class="card">
    <div class="card">
      <!--      학생 리스트 표시 -->
      <div v-if="studentList" v-for="item in studentList" class="card-item">
        <div v-if="!item.profileImg" class="card-item-profile">
          <i class="fa-solid fa-user"></i>
        </div>
        <!--        TODO [파일 서버] 프로필 사진 삽입 수정 -->
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
                <span class="number"
                  >{{ item.emergency.substring(0, 3) }}-{{
                    item.emergency.substring(3, 7)
                  }}-{{ item.emergency.substring(7, 11) }}</span
                >
              </div>
            </div>
          </div>
        </div>
        <!--        <div class="card-item-detail" @click="openModal('STU', item)">-->
        <div class="card-item-detail" @click="$emit('showStudentDetail', item)">
          <span>상세</span>
          <span>조회</span>
        </div>
      </div>

      <!--      강사 리스트 표시 -->
      <div v-if="teacherList" v-for="item in teacherList" class="card-item">
        <div v-if="!item.profileImg" class="card-item-profile">
          <i class="fa-solid fa-user"></i>
        </div>
        <!--        TODO [파일 서버] 프로필 사진 삽입 수정 -->
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
        <div class="card-item-detail" @click="$emit('showTeacherDetail', item)">
          <span>상세</span>
          <span>조회</span>
        </div>
      </div>
    </div>
  </section>
</template>
