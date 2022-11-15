<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { defaultInterface } from "../../lib/types";
export default defineComponent({
  name: "SelectButtonComponent",
  props: {
    stateValue: {
      types: Array as PropType<Array<defaultInterface>>,
      required: true,
    },
    selectValue: {
      types: String as PropType<string>,
      required: true,
    },
  },
  setup(props) {
    const selectItem = ref<Array<defaultInterface>>(
      props.stateValue as defaultInterface[]
    );
    const selectState = ref<string>(props.selectValue as string);

    watch(
      () => props.selectValue,
      () => {
        selectState.value = props.selectValue as string;
      }
    );

    return {
      selectItem,
      selectState,
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
            selectState === selectItem[0].KEY
              ? 'select-state-ok-active'
              : 'select-state-ok'
          "
          @click="$emit('changeState', selectItem[0].KEY)"
        >
          {{ selectItem[0].VALUE }}
        </div>
        <div
          :class="
            selectState === selectItem[1].KEY
              ? 'select-state-wait-active'
              : 'select-state-wait'
          "
          @click="$emit('changeState', selectItem[1].KEY)"
        >
          {{ selectItem[1].VALUE }}
        </div>
      </div>
    </div>
  </section>
</template>
