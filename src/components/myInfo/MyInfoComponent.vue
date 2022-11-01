<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import {
  adminInterface,
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import { USER_KEY } from "../../constant";
export default defineComponent({
  name: "MyInfoComponent",
  props: {
    userKey: {
      type: String as PropType<string | undefined>,
      required: true,
    },
    userData: {
      type: Object as PropType<
        studentInterface | parentInterface | teacherInterface
      >,
      required: true,
    },
  },
  setup(props) {
    const studentInfo = ref<studentInterface | undefined>(undefined);
    const parentInfo = ref<parentInterface | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const editState = ref(false);

    onMounted(() => {
      if (props.userKey === USER_KEY.PAR) {
        parentInfo.value = props.userData as parentInterface;
      } else if (props.userKey === USER_KEY.STU) {
        studentInfo.value = props.userData as studentInterface;
      } else if (props.userKey === USER_KEY.TEA) {
        teacherInfo.value = props.userData as teacherInterface;
      }
    });
    return {
      studentInfo,
      parentInfo,
      teacherInfo,
      editState,
    };
  },
});
</script>

<template>
  <section class="my-info">
    <div class="my-info">
      <div class="my-info-section">
        <div class="my-info-section-tag">tag</div>
        <div class="my-info-section-main" v-if="teacherInfo">
          <div class="my-info-section-main-img">
            <i class="fa-solid fa-camera"></i>
            <i class="fa-solid fa-user" v-if="!teacherInfo?.profileImg"></i>
            <input type="file" v-if="teacherInfo?.profileImg" />
          </div>
          <div class="my-info-section-main-content">
            <div
              class="my-info-section-main-content-text"
              v-if="teacherInfo && !editState"
            >
              <div class="name">이름 : {{ teacherInfo.name }}</div>
              <div class="id">아이디 : {{ teacherInfo.id }}</div>
              <div class="join">
                입사일 : {{ teacherInfo.joinDate.substring(0, 4) }}/{{
                  teacherInfo.joinDate.substring(5, 7)
                }}/{{ teacherInfo.joinDate.substring(8, 10) }}
              </div>
              <div class="subject">담당과목 : {{ teacherInfo.resSubject }}</div>
              <div class="part">담당학년 : {{ teacherInfo.part }}</div>
            </div>
            <div class="my-info-section-main-content-btn">
              <input
                type="button"
                class="view-btn"
                :value="teacherInfo ? '이력서 보기' : ''"
              />
              <div class="edit-btn">
                <i class="fa-solid fa-pen"></i>정보 수정
              </div>
            </div>
          </div>
        </div>

        <div class="my-info-section-main" v-if="studentInfo">
          <div class="my-info-section-main-img">
            <i class="fa-solid fa-camera"></i>
            <i class="fa-solid fa-user" v-if="!studentInfo?.profileImg"></i>
            <input type="file" v-if="studentInfo?.profileImg" />
          </div>
          <div class="my-info-section-main-content">
            <div
              class="my-info-section-main-content-text"
              v-if="studentInfo && !editState"
            >
              <div class="name">이름 : {{ studentInfo.name }}</div>
              <div class="id">아이디 : {{ studentInfo.id }}</div>
              <div class="join">
                학교 : {{ studentInfo.school }} {{ studentInfo.grade }}학년
              </div>
              <div class="part">
                연락처 : {{ studentInfo.phone.substring(0, 3) }}-{{
                  studentInfo.phone.substring(3, 7)
                }}-{{ studentInfo.phone.substring(7, 11) }}
              </div>
            </div>
            <div class="my-info-section-main-content-btn">
              <input
                type="button"
                class="view-btn"
                :value="studentInfo ? '세부 정보' : ''"
              />
              <div class="edit-btn">
                <i class="fa-solid fa-pen"></i>정보 수정
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
