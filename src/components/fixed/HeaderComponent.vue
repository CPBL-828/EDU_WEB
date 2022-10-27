<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { KYO_MAIN, KYO_SUB, TEA_MAIN, TEA_SUB } from "../../dummyCategory";
import { categoryInterface, defaultInterface } from "../../lib/types";
import common from "../../lib/common";
import { KEYS, USER_KEY } from "../../constant";
export default defineComponent({
  name: "HeaderComponent",
  setup() {
    const route = useRoute();
    const router = useRouter();
    const userKey = ref<string | undefined>(undefined);
    const mr = ref<string | undefined>(undefined);
    const main = ref<string | undefined>(undefined);
    const sr = ref<string | undefined>(undefined);
    const sub = ref<string | undefined>(undefined);
    const showRoute = ref(false);

    const findRoute = () => {
      mr.value = common.getItem(KEYS.MR).mr?.split("/")[0]?.toUpperCase();
      sr.value = common.getItem(KEYS.SR)
        ? common.getItem(KEYS.SR).sr?.split("/")[0]?.toUpperCase()
        : undefined;

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
      } else if (userKey.value === USER_KEY.ADM) {
        KYO_MAIN.map((item: categoryInterface) => {
          if (mr.value === item.KEY) {
            main.value = item.VALUE as string;

            KYO_SUB.map((child: defaultInterface) => {
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
    };

    watch(
      () => route.path,
      () => {
        if (route.path === "/main") {
          showRoute.value = false;
        } else {
          showRoute.value = true;
          findRoute();
        }
      }
    );

    onMounted(() => {
      if (common.getItem(KEYS.UK)) {
        userKey.value = common.getItem(KEYS.UK).userKey;
      }

      if (route.path === "/main") {
        showRoute.value = false;
      } else {
        showRoute.value = true;
        findRoute();
      }
    });

    return {
      main,
      sub,
      showRoute,
    };
  },
});
</script>

<template>
  <section class="header">
    <div class="header">
      <div class="path" v-if="showRoute">
        <i class="fa-solid fa-bars"></i>
        {{ main }}<i class="fa-solid fa-angle-right" v-if="sub"></i
        >{{ sub ? sub : "" }}
      </div>
    </div>
  </section>
</template>
