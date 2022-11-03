<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { studentInterface, teacherInterface } from "../lib/types";
import { USER_KEY } from "../constant";
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
    searchList: {
      types: Object as PropType<Array<studentInterface | teacherInterface>>,
      required: false,
    },
  },
  setup(props) {
    const studentList = ref<Array<studentInterface> | undefined>(undefined);
    const teacherList = ref<Array<teacherInterface> | undefined>(undefined);

    watch(
      () => props.searchList,
      () => {
        if (Object.keys(props.searchList as object).length > 0) {
          if (props.viewUser === USER_KEY.STU) {
            studentList.value = props.searchList as studentInterface[];
          } else {
            teacherList.value = props.searchList as teacherInterface[];
          }
        } else {
          if (props.viewUser === USER_KEY.STU) {
            studentList.value = props.userList as studentInterface[];
          } else {
            teacherList.value = props.userList as teacherInterface[];
          }
        }
      }
    );

    onMounted(() => {
      if (props.viewUser === USER_KEY.STU) {
        studentList.value = props.userList as studentInterface[];
      } else {
        teacherList.value = props.userList as teacherInterface[];
      }
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
            <span class="school">{{ item.school }}</span>
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
                <span class="number">어떻게 알아</span>
              </div>
            </div>
          </div>
        </div>
        <div class="card-item-detail">상세 조회</div>
      </div>
    </div>
  </section>
</template>
