<script lang="ts">
import { defineComponent, Prop, PropType, ref, watch } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "ModalPopupComponent",
  props: {
    title: {
      types: String as PropType<string>,
      required: true,
    },
  },
  setup() {
    const store = useStore();
    const popupState = ref(false);

    const onClickAway = (e: Event) => {
      if (e.isTrusted) {
        store.commit("setModalState", false);
        popupState.value = false;
      }
    };

    const closeModal = () => {
      store.commit("setModalState", false);
      popupState.value = false;
    };

    watch(
      () => store.state.modalState,
      () => {
        popupState.value = store.state.modalState;
      }
    );

    return {
      popupState,
      onClickAway,
      closeModal,
    };
  },
});
</script>

<template>
  <section class="modal" v-if="popupState" v-click-away="onClickAway">
    <div class="modal">
      <span class="modal-title">{{ title }}</span>
      <i class="fa-solid fa-rectangle-xmark" @click="closeModal"></i>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
    </div>
  </section>
</template>
