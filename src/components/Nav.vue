<template>
  <div class="nav">
    <van-nav-bar left-arrow>
      <template #left>
        <div class="logo-box">
          <div class="logo"><img src="../assets/logo.png" alt="" /></div>
          <div class="text">Coffee</div>
        </div>
      </template>

      <template #right>
        <router-link class="right-title" tag="a" to="/home">先看一下</router-link>
      </template>
    </van-nav-bar>
  </div>

  
</template>

<script>
import "../assets/less/nav.less";
export default {
  name: "Nav",
};
</script>
