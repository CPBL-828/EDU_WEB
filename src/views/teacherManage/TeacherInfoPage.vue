<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import CardListComponent from "../../components/CardListComponent.vue";
import { defaultInterface, teacherInterface } from "../../lib/types";
import common from "../../lib/common";
import { KEYS } from "../../constant";
export default defineComponent({
  name: "TeacherInfoPage",
  components: { CardListComponent },
  setup() {
    const userKey = ref<string | undefined>(undefined);
    const teacherInfo = ref<teacherInterface | undefined>(undefined);
    const category = ref<Array<defaultInterface> | undefined>(undefined);

    onMounted(() => {
      userKey.value = common.getItem(KEYS.UK).userKey;
      category.value = common.findCategory();
    });

    return {
      userKey,
      teacherInfo,
      category,
    };
  },
});
</script>

<template>
  <section class="teacher-info">
    <div class="teacher-info">
      <div class="teacher-info-section">
        <div class="teacher-info-section-tag">
          {{
            category
              ? category[1]["VALUE"]
                ? category[1]["VALUE"]
                : category[0]["VALUE"]
              : ""
          }}
        </div>
        <div class="teacher-info-section-body">
          <card-list-component></card-list-component>
        </div>
      </div>
    </div>
  </section>
</template>
