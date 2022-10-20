<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import SidebarComponent from "./components/SidebarComponent.vue";
import { useRoute } from "vue-router";
import CalendarPopup from "./components/CalendarPopup.vue";

export default defineComponent({
  components: { CalendarPopup, SidebarComponent },
  setup() {
    const route = useRoute();
    const sidebarState = ref(true);
    onMounted(() => {
      console.log(
        "  ハ____ハ      ｡ﾟﾟ･｡･ﾟﾟ｡\n" +
          " ꒰ ⬩ ω ⬩ ꒱    ˚｡    ｡˚\n" +
          " |   つ Success! ﾟ･｡･ﾟ\n"
      );
    });

    watch(
      () => route.path,
      () => {
        sidebarState.value =
          route.path === "/" || route.path.substring(5, 10) === "login";
      }
    );

    return {
      sidebarState,
    };
  },
});
</script>

<template>
  <calendar-popup v-if="!sidebarState"></calendar-popup>
  <sidebar-component v-if="!sidebarState"></sidebar-component>
  <router-view></router-view>
</template>

<style src="./assets/css/index.css"></style>
