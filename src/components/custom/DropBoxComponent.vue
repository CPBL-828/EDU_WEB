<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { defaultInterface } from "../../lib/types";
/*
@brief 기존의 선택 박스와 동일한 기능
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
    rowHeight: {
      types: String as PropType<string>,
      default: "33px",
    },
  },
  setup(props, context) {
    const { emit } = context;
    const main = ref<string>(props.placeholder as string);
    const openState = ref(false);
    const itemList = ref<Array<defaultInterface>>(
      props.selectList as defaultInterface[]
    );
    const selectItem = ref<string | undefined>(undefined);

    const onClickAway = (event: Event) => {
      if (event.isTrusted) {
        openState.value = false;
      }
    };

    const changeOpenState = () => {
      openState.value = !openState.value;
    };

    const changeItem = (i: defaultInterface) => {
      selectItem.value = i.KEY;
      main.value = i.VALUE as string;
      emit("selectValue", i);
    };

    watch(
      () => props.placeholder,
      () => {
        main.value = props.placeholder as string;
      }
    );

    watch(
      () => props.selectList,
      () => {
        itemList.value = props.selectList as defaultInterface[];
      }
    );

    return {
      main,
      openState,
      itemList,
      selectItem,
      onClickAway,
      changeOpenState,
      changeItem,
    };
  },
});
</script>

<template>
  <section class="drop" v-click-away="onClickAway">
    <div
      class="drop"
      @click="changeOpenState"
      :style="{
        width: rowWidth,
        height: rowHeight,
      }"
    >
      {{ main }}
      <i
        class="fa-solid fa-chevron-down"
        v-if="Number(rowWidth.substring(-3, 0)) > 100"
      ></i>
    </div>
    <div
      :class="!openState ? 'drop-list' : 'drop-list-opened'"
      :style="{ width: rowWidth }"
    >
      <div
        v-if="openState"
        v-for="item in itemList"
        :class="
          selectItem === item?.KEY ? 'drop-list-item-active' : 'drop-list-item'
        "
        @click="changeItem(item)"
      >
        {{ item?.VALUE }}
      </div>
    </div>
  </section>
</template>
