<script lang="ts">
import { defineComponent, PropType, ref, watch } from "vue";
import { useStore } from "vuex";

export default defineComponent({
  name: "ModalPopupComponent",
  props: {
    title: {
      types: String as PropType<string>,
      required: true,
    },
    modalHeight: {
      types: String as PropType<string>,
      required: false,
    },
    modalWidth: {
      types: String as PropType<string>,
      required: false,
    },
  },
  setup() {
    const store = useStore();
    const modalState = ref(false);

    const closeModal = () => {
      store.commit("setModalState", false);
      modalState.value = false;
    };

    watch(
      () => store.state.modalState,
      () => {
        modalState.value = store.state.modalState;
      }
    );

    return {
      modalState,
      closeModal,
    };
  },
});
</script>

<template>
  <section
    class="modal"
    v-if="modalState"
    :style="{
      width: modalWidth ? modalWidth.toString() : '1078px',
      height: modalHeight ? modalHeight.toString() : '808px',
    }"
  >
    <div class="modal">
      <div class="modal-button">
        <slot name="button"></slot>
      </div>
      <span class="modal-title">{{ title }}</span>
      <i class="fa-solid fa-rectangle-xmark" @click="closeModal"></i>
      <div class="modal-body">
        <slot name="body"></slot>
      </div>
    </div>
  </section>
</template>
