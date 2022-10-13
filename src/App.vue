<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import SidebarComponent from "./components/SidebarComponent.vue";
import { useRoute } from "vue-router";

export default defineComponent({
  components: { SidebarComponent },
  setup() {
    const route = useRoute();
    const sidebarState = ref(false);
    onMounted(() => {
      console.log(
        "  ハ____ハ      ｡ﾟﾟ･｡･ﾟﾟ｡\n" +
          " ꒰ ⬩ ω ⬩ ꒱    ˚｡    ｡˚\n" +
          " |   つ Success! ﾟ･｡･ﾟ\n"
      );
      console.log(route.path);
    });

    watch(
      () => route.path,
      () => {
        if (route.path !== "/" && route.path.substring(1, 6) !== "login") {
          sidebarState.value = true;
        }
      }
    );

    return {
      sidebarState,
    };
  },
});
</script>

<template>
  <sidebar-component v-if="sidebarState"></sidebar-component>
  <router-view></router-view>
</template>

<style src="./assets/css/index.css"></style>
