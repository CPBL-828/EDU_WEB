<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { defaultInterface } from "../../lib/types";

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
    const mainHolder = ref<string>(props.placeholder as string);
    const openState = ref(false);
    const itemList = ref<Array<defaultInterface>>(
      props.selectList as defaultInterface[]
    );
    const selectedItem = ref<string | undefined>(undefined);

    const onClickAway = (event: Event) => {
      if (event.isTrusted) {
        openState.value = false;
      }
    };

    const changeOpenState = () => {
      openState.value = !openState.value;
    };

    const selectItem = (item: defaultInterface) => {
      selectedItem.value = item.KEY;
      mainHolder.value = item.VALUE as string;
      emit("selectValue", item);
    };

    watch(
      () => props.placeholder,
      () => {
        mainHolder.value = props.placeholder as string;
      }
    );

    watch(
      () => props.selectList,
      () => {
        itemList.value = props.selectList as defaultInterface[];
      }
    );

    return {
      mainHolder,
      openState,
      itemList,
      selectedItem,
      onClickAway,
      changeOpenState,
      selectItem,
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
      {{ mainHolder }}
      <i
        class="fa-solid fa-chevron-down"
        v-if="!rowWidth || Number(rowWidth.split('px')[0]) > 150"
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
          selectedItem === item?.KEY
            ? 'drop-list-item-active'
            : 'drop-list-item'
        "
        @click="selectItem(item)"
      >
        {{ item?.VALUE }}
      </div>
    </div>
  </section>
</template>
