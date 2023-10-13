import { createStore } from "vuex";

export default createStore({
  state: {
    modalState: false,
  },
  mutations: {
    setModalState(state, value) {
      state.modalState = value;
    },
  },
  getters: {
    getModalState(state) {
      return state.modalState;
    },
  },
});
