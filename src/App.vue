<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import SidebarComponent from "./components/fixed/SidebarComponent.vue";
import { useRoute } from "vue-router";
import CalendarPopup from "./components/fixed/CalendarPopup.vue";
import HeaderComponent from "./components/fixed/HeaderComponent.vue";
import { useStore } from "vuex";

export default defineComponent({
  components: { HeaderComponent, CalendarPopup, SidebarComponent },
  setup() {
    const route = useRoute();
    const store = useStore();
    const sidebarState = ref(true);
    const modalBackgroundState = ref(false);

    watch(
      () => route.path,
      () => {
        sidebarState.value =
          route.path === "/" || route.path.split("/")[2] === "login";
      }
    );

    watch(
      () => store.state.modalState,
      () => {
        modalBackgroundState.value = store.state.modalState;
      }
    );

    return {
      sidebarState,
      modalBackgroundState,
    };
  },
});
</script>

<template>
  <div class="modal-back" v-if="modalBackgroundState"></div>
  <calendar-popup v-if="!sidebarState"></calendar-popup>
  <sidebar-component v-if="!sidebarState"></sidebar-component>
  <header-component v-if="!sidebarState"></header-component>
  <router-view></router-view>
</template>

<style src="./assets/css/index.css"></style>
