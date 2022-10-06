<script lang="ts">
import { defineComponent, ref } from "vue";
import LoginComponent from "../components/LoginComponent.vue";
export default defineComponent({
  name: "InitPage",
  components: { LoginComponent },
  setup() {
    return {};
  },
});
</script>

<template>
  <login-component></login-component>
</template>
