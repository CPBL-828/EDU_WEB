<script lang="ts">
import { defineComponent } from "vue";
import LoginComponent from "../../components/main/LoginComponent.vue";

export default defineComponent({
  name: "LoginPage",
  components: { LoginComponent },
});
</script>

<template>
  <login-component></login-component>
</template>
