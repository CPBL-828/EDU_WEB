<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
import { defaultInterface } from "../../lib/types";

/*
@brief 기존의 선택 박스와 동일한 기능
@props placeholder, selectList, rowWidth
 */
export default defineComponent({
  name: "DropBoxComponent",
  props: {
    placeholder: {
      types: String as PropType<string>,
      required: true,
    },
    selectList: {
      types: Object as PropType<Array<defaultInterface>>,
      required: true,
    },
    rowWidth: {
      types: String as PropType<string>,
      default: "270px",
    },
  },
  setup(props) {
    const openState = ref(false);
    const itemList: defaultInterface[] = props.selectList as defaultInterface[];
    const selectItem = ref<string | undefined>(undefined);

    const changeOpenState = () => {
      openState.value = !openState.value;
    };

    const changeItem = (v: string) => {
      selectItem.value = v;
    };

    return {
      openState,
      itemList,
      selectItem,
      changeOpenState,
      changeItem,
    };
  },
});
</script>

<template>
  <section class="drop" :style="'width: ' + rowWidth">
    <div class="drop" @click="changeOpenState">
      {{ placeholder }}
    </div>
    <div :class="!openState ? 'drop-list' : 'drop-list-opened'">
      <div
        v-for="item in itemList"
        :class="
          selectItem === item?.KEY ? 'drop-list-item-active' : 'drop-list-item'
        "
        @click="changeItem(item?.KEY)"
      >
        {{ item?.VALUE }}
      </div>
    </div>
  </section>
</template>
