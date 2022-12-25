<script lang="ts">
import { defineComponent, onMounted, PropType, ref } from "vue";
import CardListComponent from "./custom/CardListComponent.vue";
import {
  adminInterface,
  defaultInterface,
  scheduleInterface,
  studentInterface,
  teacherInterface,
} from "../lib/types";
import common from "../lib/common";
import { KEYS, RESULT_KEY, USER_KEY } from "../constant";
import { ApiClient } from "../axios";
import DropBoxComponent from "./custom/DropBoxComponent.vue";
import ModalPopupComponent from "./custom/ModalPopupComponent.vue";
import SelectButtonComponent from "./custom/SelectButtonComponent.vue";
import { useRouter } from "vue-router";
/*
@brief [강사] [Main]학생 관리, [관리자] [Main]학생 관리, 강사 관리
       [Sub]학생 정보, 강사 정보 접근 시 카드형 컴포넌트를 통해 유저 리스트 표시
@props 보여주고자 하는 유저 값
 */
export default defineComponent({
  name: "UserInfoComponent",
  props: {
    viewUser: {
      types: String as PropType<string>,
      required: true,
    },
  },
  components: {
    SelectButtonComponent,
    ModalPopupComponent,
    DropBoxComponent,
    CardListComponent,
  },
  setup(props) {
    const router = useRouter();
    const category = ref<Array<defaultInterface> | undefined>(undefined);
    const loginUser = ref<teacherInterface | adminInterface | undefined>(
      undefined
    );
    const teacherKey = ref<string>("");
    const adminState = ref(false);
    const userKey = ref<string | undefined>(undefined);
    const userData = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);
    const total = ref<string | undefined>(undefined);
    const search = ref<string | undefined>(undefined);
    const searchData = ref<
      Array<studentInterface | teacherInterface> | undefined
    >(undefined);
    const lectureList = ref<Array<defaultInterface>>([]);
    const lectureKey = ref<string>("");
    const createMode = ref<string | undefined>(undefined);
    const gradeList: defaultInterface[] = [
      { KEY: "elementary", VALUE: "초등" },
      { KEY: "middle", VALUE: "중등" },
      { KEY: "high", VALUE: "고등" },
      { KEY: "repeat", VALUE: "재수" },
      { KEY: "essay", VALUE: "논술면접" },
      { KEY: "entrance", VALUE: "입시지도" },
      { KEY: "overseas", VALUE: "해외" },
      { KEY: "characterization", VALUE: "특성화" },
    ];
    const subjectList: defaultInterface[] = [
      { KEY: "KOR", VALUE: "국어" },
      { KEY: "ENG", VALUE: "영어" },
      { KEY: "MATH", VALUE: "수학" },
      { KEY: "HISTORY", VALUE: "수학" },
      { KEY: "RESEARCH", VALUE: "탐구" },
      { KEY: "CHARACTER", VALUE: "특성화" },
      { KEY: "ESSAY", VALUE: "논술" },
      { KEY: "DEPRECIATION", VALUE: "경시" },
      { KEY: "SAT", VALUE: "SAT" },
      { KEY: "ACT", VALUE: "ACT" },
      { KEY: "AP", VALUE: "AP" },
    ];
    const birthNum = ref<string | undefined>(undefined);
    const insertStudentData = ref({
      name: "",
      birth: "",
      sex: "",
      phone: "",
      emergency: "01011911211",
      school: "",
      grade: "",
      address: "",
      remark: "",
      delState: "N",
      profileImg: "",
    });
    const teacherLevel = ref<string | undefined>(undefined);
    const teacherGrade = ref<number | undefined>(undefined);
    const insertTeacherData = ref({
      name: "",
      phone: "",
      email: "",
      link: "",
      part: "",
      resSubject: "",
      joinDate: "",
      leaveDate: "1111-11-11",
      resume: "이력서 파일",
      profileImg: "",
    });

    const getUserList = async () => {
      let data = {
        userKey: "",
        search: "",
      };
      if (search.value) {
        data = Object.assign(data, { search: search.value });
      }
      if (common.getItem(KEYS.UK).userKey.slice(-3) !== USER_KEY.ADM) {
        data = Object.assign(data, {
          userKey: teacherKey.value,
        });
      } else {
        data = Object.assign(data, {
          userKey: "",
          lectureKey: lectureKey.value,
        });
      }

      if (props.viewUser === USER_KEY.STU) {
        data = Object.assign(data, { lectureKey: lectureKey.value });

        const result = await ApiClient(
          "/members/getStudentList/",
          common.makeJson(data)
        );

        if (result) {
          userData.value = [];

          if (result.count > 0) {
            userData.value = result.resultData as studentInterface[];
            total.value = result.count;
          } else {
            if (search.value) {
              window.alert("검색 내용을 찾을 수 없어요.");
            }
          }
        }
      } else {
        const result = await ApiClient(
          "/members/getTeacherList/",
          common.makeJson(data)
        );

        if (result) {
          userData.value = [];

          if (result.count > 0) {
            userData.value = result.resultData as teacherInterface[];
            total.value = result.count;
          } else {
            if (search.value) {
              window.alert("검색 내용을 찾을 수 없어요.");
            }
          }
        }
      }
    };

    const getScheduleList = async () => {
      let data = {
        userKey: teacherKey.value ? teacherKey.value : "",
        search: "",
        roomKey: "",
        target: "",
        roomName: "",
        lectureName: "",
      };

      const result = await ApiClient(
        "/lectures/getLectureList/",
        common.makeJson(data)
      );

      if (result) {
        if (result.count > 0) {
          result.resultData.map((item: scheduleInterface) => {
            lectureList.value.push({
              KEY: item.lectureKey,
              VALUE: item.lectureName,
            });
          });
        }
      }
    };

    const selectLecture = async (l: defaultInterface) => {
      lectureKey.value = l.KEY;
      await getUserList();
    };

    const changeCreateMode = (u: string) => {
      createMode.value = u;
    };

    const selectGrade = (l: defaultInterface) => {
      teacherLevel.value = l.VALUE as string;
    };

    const selectSubject = (s: defaultInterface) => {
      insertTeacherData.value.resSubject = s.VALUE as string;
    };

    const insertStudent = async () => {
      if (!insertStudentData.value.name) {
        window.alert("학생명을 입력해주세요.");
        return false;
      } else if (!insertStudentData.value.phone) {
        window.alert("연락처를 입력해주세요.");
        return false;
      } else if (!insertStudentData.value.school) {
        window.alert("학교명을 입력해주세요.");
        return false;
      } else if (!insertStudentData.value.grade) {
        window.alert("학년을 입력해주세요.");
        return false;
      } else if (!insertStudentData.value.address) {
        window.alert("주소를 입력해주세요.");
        return false;
      }

      if (!birthNum.value) {
        window.alert("주민번호를 입력해주세요.");
      } else {
        if (birthNum.value.length > 9 || birthNum.value.length < 9) {
          window.alert(
            "생년월일 값이 올바르지 않습니다.\n주민번호 뒷자리 첫 번째 숫자까지 총 9자리를 입력해주세요."
          );
          return false;
        } else {
          insertStudentData.value.birth = new Date(
            birthNum.value.substring(0, 4) +
              "-" +
              birthNum.value.substring(4, 6) +
              "-" +
              birthNum.value.substring(6, 8)
          )
            .toISOString()
            .substring(0, 10);

          insertStudentData.value.sex =
            Number(birthNum.value.substring(-1)) % 2 === 0 ? "여" : "남";
        }
      }

      const result = await ApiClient(
        "/members/createStudent/",
        common.makeJson(insertStudentData.value)
      );
    };

    const insertTeacher = async () => {
      if (!insertTeacherData.value.name) {
        window.alert("강사명을 입력해주세요.");
        return false;
      } else if (!insertTeacherData.value.phone) {
        window.alert("연락처를 입력해주세요.");
        return false;
      } else if (!insertTeacherData.value.email) {
        window.alert("이메일을 입력해주세요.");
        return false;
      } else if (!insertTeacherData.value.link) {
        window.alert("개인 SNS 링크를 입력해주세요.");
        return false;
      } else if (!insertTeacherData.value.resSubject) {
        window.alert("담당 과목을 선택해주세요.");
        return false;
      }

      if (teacherGrade.value && teacherLevel.value) {
        insertTeacherData.value.part = teacherLevel.value + teacherGrade.value;
      } else if (!teacherLevel.value) {
        window.alert("담당 학급을 선택해주세요.");
        return false;
      } else if (!teacherGrade.value) {
        window.alert("담당 학년을 선택해주세요.");
        return false;
      }

      const result = await ApiClient(
        "/members/createTeacher/",
        common.makeJson(insertTeacherData.value)
      );

      if (result) {
        if (result.chunbae === RESULT_KEY.CREATE) {
          window.alert("강사 정보가 저장되었습니다.");
          router.go(0);
        }
      } else {
        window.alert(
          "강사 정보를 저장하지 못했습니다.\n입력 값을 다시 확인해주세요."
        );
        return false;
      }
    };

    onMounted(async () => {
      category.value = common.findCategory();
      userKey.value = common.getItem(KEYS.UK).userKey;

      if (common.getItem(KEYS.LU)) {
        if (userKey.value === USER_KEY.TEA) {
          loginUser.value = common.getItem(KEYS.LU) as teacherInterface;
          teacherKey.value = common.getItem(KEYS.LU).teacherKey;
        } else if (userKey.value === USER_KEY.KYO_ADM) {
          adminState.value = true;
          loginUser.value = common.getItem(KEYS.LU) as adminInterface;
        }
      }

      await getUserList();
      await getScheduleList();
    });

    return {
      category,
      teacherKey,
      adminState,
      userKey,
      userData,
      total,
      search,
      searchData,
      lectureList,
      createMode,
      gradeList,
      teacherGrade,
      subjectList,
      birthNum,
      insertStudentData,
      insertTeacherData,
      getUserList,
      selectLecture,
      changeCreateMode,
      selectGrade,
      selectSubject,
      insertStudent,
      insertTeacher,
    };
  },
});
</script>

<template>
  <section class="user-info" v-if="!createMode">
    <div class="user-info">
      <div class="user-info-section">
        <div class="user-info-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="user-info-section-body" v-if="viewUser === 'STU'">
          <div class="filter">
            <div class="filter-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                v-model="search"
                placeholder="학생명, 학교명으로 검색"
                @keypress.enter="getUserList"
              />
            </div>
            <div class="sap"></div>
            <div class="filter-lecture">
              <drop-box-component
                :select-list="lectureList"
                placeholder="강의 선택"
                rowWidth="275px"
                @selectValue="selectLecture"
              ></drop-box-component>
            </div>
            <div class="sap" v-if="!teacherKey"></div>
            <input
              type="button"
              value="생성하기"
              class="filter-create-btn"
              v-if="adminState"
              @click="changeCreateMode('STU')"
            />
          </div>
          <span v-if="total" class="total">학생 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
          <span v-if="!userData" class="total"
            >등록된 학생 정보가 없습니다.</span
          >
        </div>
        <div class="user-info-section-body" v-if="viewUser === 'TEA'">
          <div class="filter">
            <div class="filter-search">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                v-model="search"
                placeholder="강사명, 담당 학년, 담당 과목으로 검색"
                @keypress.enter="getUserList"
              />
            </div>
            <div class="sap"></div>
            <input
              type="button"
              value="생성하기"
              class="filter-create-btn"
              @click="changeCreateMode('TEA')"
            />
          </div>
          <span v-if="total" class="total">강사 총 원 : {{ total }} 명</span>
          <card-list-component
            v-if="userData && viewUser"
            :view-user="viewUser"
            :user-list="userData"
          ></card-list-component>
          <span v-if="!userData" class="total">
            등록된 강사 정보가 없습니다.
          </span>
        </div>
      </div>
    </div>
  </section>

  <section class="student-insert" v-else>
    <div class="student-insert">
      <div class="student-insert-section">
        <div class="student-insert-section-tag">
          {{ createMode === "STU" ? "학생 생성" : "강사 생성" }}
        </div>
        <div class="student-insert-section-body" v-if="createMode === 'STU'">
          <span class="back" @click="$router.go(0)">목록으로 돌아가기</span>
          <input
            type="button"
            class="insert-btn"
            value="저장하기"
            @click="insertStudent"
          />
          <div class="student-insert-section-body-container">
            <div class="student-insert-section-body-container-profile">
              <span>증명사진을</span>
              <span>첨부해주세요.</span>
              <i class="fa-solid fa-camera"></i>
              <input type="file" />
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-name">
                <span>이름 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="이름"
                  v-model="insertStudentData.name"
                />
              </div>

              <div class="student-insert-section-body-container-info-birth">
                <span
                  >생년월일 8자리 + 주민번호 뒷자리 첫 번째
                  <span class="red">(필수)</span></span
                >
                <div>
                  <input
                    type="text"
                    placeholder="YYYYMMDDN"
                    v-model="birthNum"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-phone">
                <span>번호 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="'-' 없이 번호만 입력"
                  v-model="insertStudentData.phone"
                />
              </div>
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-school">
                <span>학교 <span class="red">(필수)</span></span>
                <div>
                  <input
                    type="text"
                    class="input-school"
                    placeholder="학교명"
                    v-model="insertStudentData.school"
                  />
                  <input
                    type="number"
                    class="input-grade"
                    placeholder="학년"
                    min="1"
                    max="6"
                    v-model="insertStudentData.grade"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-address">
                <span>주소 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="주소"
                  v-model="insertStudentData.address"
                />
              </div>

              <div class="student-insert-section-body-container-info-remark">
                <span>특이사항</span>
                <textarea
                  type="text"
                  placeholder="특이사항"
                  class="input-remark"
                  v-model="insertStudentData.remark"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="student-insert-section-body" v-if="createMode === 'TEA'">
          <span class="back" @click="$router.go(0)">목록으로 돌아가기</span>
          <input
            type="button"
            class="insert-btn"
            value="저장하기"
            @click="insertTeacher"
          />
          <div class="student-insert-section-body-container">
            <div class="student-insert-section-body-container-profile">
              <span>증명사진을</span>
              <span>첨부해주세요.</span>
              <i class="fa-solid fa-camera"></i>
              <input type="file" />
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-name">
                <span>이름 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="이름"
                  v-model="insertTeacherData.name"
                />
              </div>

              <div class="student-insert-section-body-container-info-phone">
                <span>번호 <span class="red">(필수)</span></span>
                <input
                  type="text"
                  placeholder="'-' 없이 번호만 입력"
                  v-model="insertTeacherData.phone"
                />
              </div>

              <div class="student-insert-section-body-container-info-school">
                <span>담당 <span class="red">(필수)</span></span>
                <div>
                  <div
                    class="student-insert-section-body-container-info-school-drop"
                  >
                    <drop-box-component
                      :select-list="gradeList"
                      placeholder="학급"
                      row-width="60px"
                      row-height="30px"
                      @selectValue="selectGrade"
                    ></drop-box-component>

                    <input
                      type="number"
                      class="input-grade"
                      placeholder="학년"
                      min="1"
                      max="6"
                      :style="{
                        color: '#565656',
                      }"
                      v-model="teacherGrade"
                    />

                    <drop-box-component
                      :select-list="subjectList"
                      placeholder="과목"
                      row-width="60px"
                      row-height="30px"
                      @selectValue="selectSubject"
                    ></drop-box-component>
                  </div>
                </div>
              </div>
            </div>

            <div class="student-insert-section-body-container-info">
              <div class="student-insert-section-body-container-info-email">
                <span>이메일 <span class="red">(필수)</span></span>
                <div>
                  <input
                    type="text"
                    placeholder="이메일"
                    v-model="insertTeacherData.email"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-email">
                <span>SNS <span class="red">(필수)</span></span>
                <div>
                  <input
                    type="text"
                    placeholder="SNS 링크"
                    v-model="insertTeacherData.link"
                  />
                </div>
              </div>

              <div class="student-insert-section-body-container-info-address">
                <span>입사일</span>
                <input
                  type="text"
                  placeholder="YYYY-MM-DD"
                  v-model="insertTeacherData.joinDate"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
