<template>
  <div class="background">
      <div class="back-box"></div>
    <div class="back">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import "../assets/less/background.less";
export default {
  name: "Background",
};
</script>
