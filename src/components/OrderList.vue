<template>
  <div class="order-item">
    <div class="pro-img">
      <img class="img-auto" :src="product.small_img" alt="">
    </div>
    <div class="pro-info">
      <div class="pro-top">
        <div class="pro-name">
          <div class="p-name">{{product.name}}</div>
          <div class="p-rule">{{product.rule}}</div>
        </div>
        <div class="p-enname">{{product.enname}}</div>
      </div>
      <div class="pro-bottom">
        <div class="p-price">￥{{product.price}}</div>
        <div class="p-count">x{{product.count}}</div>
      </div>
    </div>
  </div>
</template>

<script>
  import '../assets/less/orderlist.less';
  export default {
    name: 'OrderList',
    props: {
      product: {
        type: Object,
        //当props的属性为引用类型数据, 默认值必须使用default函数返回
        default() {
          return {};
        }
      }
    }
  }
</script>