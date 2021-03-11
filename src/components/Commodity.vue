<template>
  <!-- 商品组件  点击跳转到商品详情 -->
  <div class="commodity" @click="Skipdetails(commodity.pid)">
      <div class="list">
        <div class="imglist">
          <img :src="commodity.largeImg" alt="" />
        </div>

        <div class="list-text">
          <p>{{ commodity.name }}</p>
          <p>{{ commodity.enname }}</p>
        </div>

        <div class="price">￥{{ commodity.price }}</div>

        <!-- hot图标 -->
        <slot name="hot"></slot>
      </div>
  </div>
</template>

<script>
import "../assets/less/commodity.less";
export default {
  name: "Commodity",
  props: {
    commodity: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    //商品详情跳转 (pid 是接口的id名称)
    Skipdetails(pid) {
      this.$router.push({ name: "Details", params: { pid } });
    },
  },
};
</script>
