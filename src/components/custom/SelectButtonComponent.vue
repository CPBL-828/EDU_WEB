<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { defaultInterface } from "../../lib/types";

export default defineComponent({
  name: "SelectButtonComponent",
  props: {
    selectList: {
      types: Array as PropType<Array<defaultInterface>>,
      required: true,
    },
    selectValue: {
      types: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const itemList = ref<Array<defaultInterface>>(
      props.selectList as defaultInterface[]
    );
    const selectedState = ref<string>(props.selectValue as string);

    watch(
      () => props.selectValue,
      () => {
        selectedState.value = props.selectValue as string;
      }
    );

    return {
      itemList,
      selectedState,
    };
  },
});
</script>

<template>
  <section class="select">
    <div class="select">
      <div class="select-state">
        <div
          :class="
            selectedState === itemList[0].KEY
              ? 'select-state-ok-active'
              : 'select-state-ok'
          "
          @click="$emit('changeState', itemList[0].KEY)"
        >
          {{ itemList[0].VALUE }}
        </div>
        <div
          :class="
            selectedState === itemList[1].KEY
              ? 'select-state-wait-active'
              : 'select-state-wait'
          "
          @click="$emit('changeState', itemList[1].KEY)"
        >
          {{ itemList[1].VALUE }}
        </div>
      </div>
    </div>
  </section>
</template>
