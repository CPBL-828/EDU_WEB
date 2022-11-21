<script lang="ts">
import { defineComponent, ref } from "vue";
import LoginComponent from "../../components/main/LoginComponent.vue";
export default defineComponent({
  name: "LoginPage",
  components: { LoginComponent },
  setup() {
    return {};
  },
});
</script>

<template>
  <login-component></login-component>
</template>
