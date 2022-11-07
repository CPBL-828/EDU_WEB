<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { studentInterface, teacherInterface } from "../../lib/types";
import { USER_KEY } from "../../constant";
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
      () => {
        setUserList();
      }
    );

    onMounted(() => {
      setUserList();
    });

    return {
      studentList,
      teacherList,
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
        <div class="card-item-detail">상세 조회</div>
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
                <span class="number">준비 중입니다.</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-item-detail">상세 조회</div>
      </div>
    </div>
  </section>
</template>
