<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0 auto;
  background: #d9dce2;
}
.img-auto {
  width: 100%;
  display: block;
}
.clear::after {
  content: "";
  clear: both;
  display: block;
}

.fl {
  float: left;
}
.fr {
  float: right;
}
</style>
