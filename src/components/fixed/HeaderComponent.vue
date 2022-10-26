<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { TEA_MAIN, TEA_SUB } from "../../dummyCategory";
import { categoryInterface, defaultInterface } from "../../lib/types";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
export default defineComponent({
  name: "HeaderComponent",
  setup() {
    const route = useRoute();
    const userKey = ref<string | undefined>(undefined);
    const mr = ref<string | undefined>(undefined);
    const main = ref<string | undefined>(undefined);
    const sr = ref<string | undefined>(undefined);
    const sub = ref<string | undefined>(undefined);

    watch(
      () => route.path,
      () => {
        mr.value = route.path.split("/")[1]?.toUpperCase();
        sr.value = route.path.split("/")[2]?.toUpperCase();

        if (userKey.value === USER_KEY.STU) {
        } else if (userKey.value === USER_KEY.PAR) {
        } else if (userKey.value === USER_KEY.TEA) {
          TEA_MAIN.map((item: categoryInterface) => {
            if (mr.value === item.KEY) {
              main.value = item.VALUE as string;

              TEA_SUB.map((child: defaultInterface) => {
                if (item.KEY === child.KEY) {
                  (child.VALUE as defaultInterface[]).map(
                    (v: defaultInterface) => {
                      if (sr.value === v.KEY) {
                        sub.value = v.VALUE as string;
                      }
                    }
                  );
                }
              });
            }
          });
        }
      }
    );

    onMounted(() => {
      if (common.getItem(KEYS.UK)) {
        userKey.value = common.getItem(KEYS.UK).userKey;
      }
    });
    return {
      mr,
      main,
      sr,
      sub,
    };
  },
});
</script>

<template>
  <section class="header">
    <div class="header">
      <div class="path">
        <i class="fa-solid fa-bars"></i>
        {{ main }}<i class="fa-solid fa-angle-right"></i>{{ sub }}
      </div>
    </div>
  </section>
</template>
