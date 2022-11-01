<script lang="ts">
import { defineComponent, onMounted, Prop, PropType, ref } from "vue";
import {
  adminInterface,
  defaultInterface,
  parentInterface,
  studentInterface,
  teacherInterface,
} from "../../lib/types";
import { KEYS, USER_KEY } from "../../constant";
import common from "../../lib/common";
import { useRoute } from "vue-router";
export default defineComponent({
  name: "MyInfoComponent",
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
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const studentInfo = ref<studentInterface | undefined>(undefined);
    const parentInfo = ref<parentInterface | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const editState = ref(false);

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
              <div class="name" v-if="teacherInfo">
                이름 : {{ teacherInfo.name }} ({{ teacherInfo.id }})
              </div>
              <div class="phone" v-if="teacherInfo">
                연락처 : {{ teacherInfo.phone.substring(0, 3) }}-{{
                  teacherInfo.phone.substring(3, 7)
                }}-{{ teacherInfo.phone.substring(7, 11) }}
              </div>
              <div class="join" v-if="teacherInfo">
                입사일 : {{ teacherInfo.joinDate.substring(0, 4) }}/{{
                  teacherInfo.joinDate.substring(5, 7)
                }}/{{ teacherInfo.joinDate.substring(8, 10) }}
              </div>
              <div class="subject" v-if="teacherInfo">
                담당과목 : {{ teacherInfo.resSubject }}
              </div>
              <div class="part" v-if="teacherInfo">
                담당학년 : {{ teacherInfo.part }}
              </div>

              <div class="name" v-if="studentInfo">
                이름 : {{ studentInfo.name }} ({{ studentInfo.id }})
              </div>
              <div class="part" v-if="studentInfo">
                연락처 : {{ studentInfo.phone.substring(0, 3) }}-{{
                  studentInfo.phone.substring(3, 7)
                }}-{{ studentInfo.phone.substring(7, 11) }}
              </div>
              <div class="join" v-if="studentInfo">
                학교 : {{ studentInfo.school?.slice(0, -3) }}
                {{ studentInfo.grade }}학년
              </div>
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
