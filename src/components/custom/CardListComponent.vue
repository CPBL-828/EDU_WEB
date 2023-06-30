<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { studentInterface, teacherInterface } from "../../lib/types";
import { CONSTANT, USER_KEY } from "../../constant";

export default defineComponent({
  name: "CardListComponent",
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
    const fileURL: string = CONSTANT.FILE_URL;
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const teacherList = ref<Array<teacherInterface> | undefined>(undefined);

    const setUserList = () => {
      if (props.viewUser === USER_KEY.STU) {
        studentList.value = props.userList as studentInterface[];
      } else {
        teacherList.value = props.userList as teacherInterface[];
      }
    };

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
      fileURL,
      studentList,
      teacherList,
    };
  },
});
</script>

<template>
  <section class="card">
    <div class="card">
      <!--      학생 리스트 표시 -->
      <div v-if="studentList" v-for="item in studentList" class="card-item">
        <div class="card-item-profile" v-if="!item.profileImg">
          <i class="fa-solid fa-user"></i>
        </div>
        <img
          v-if="item.profileImg"
          :src="fileURL + item.profileImg"
          alt="profile"
        />
        <div class="card-item-info">
          <div class="card-item-info-name">
            <span class="title">이름</span>
            <span class="name">{{ item.name }}</span>
            <span class="school">{{
              item.school
                ? `${item.school} (${item.grade}학년)`
                : "학교 정보 없음"
            }}</span>
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
        <div class="card-item-detail" @click="$emit('showStudentDetail', item)">
          <span>상세</span>
          <span>조회</span>
        </div>
      </div>

      <!--      강사 리스트 표시 -->
      <div v-if="teacherList" v-for="item in teacherList" class="card-item">
        <div class="card-item-profile" v-if="!item.profileImg">
          <i class="fa-solid fa-user"></i>
        </div>
        <img
          v-if="item.profileImg"
          :src="fileURL + item.profileImg"
          alt="profile"
        />
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
