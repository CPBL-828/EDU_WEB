<script lang="ts">
import { defineComponent, onMounted } from "vue";

export default defineComponent({
  setup() {
    onMounted(() => {
      console.log(
        "  ハ____ハ      ｡ﾟﾟ･｡･ﾟﾟ｡\n" +
          " ꒰ ⬩ ω ⬩ ꒱    ˚｡     ｡˚\n" +
          " |   つ Success! ﾟ･｡･ﾟ\n"
      );
    });
  },
});
</script>

<template>
  <router-view></router-view>
</template>

<style src="./assets/css/index.css"></style>
