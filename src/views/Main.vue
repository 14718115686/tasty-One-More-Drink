<template>
  <div class="main">
    <div>
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>

    <!-- 底部导航 -->
    <div class="tabbar-footer">
      <van-tabbar
        class="homepage"
        v-model="active"
        active-color="#00a862"
        route
      >
        <van-tabbar-item replace icon="home-o" to="/home"> 主页</van-tabbar-item>
        <van-tabbar-item replace icon="notes-o" to="/menu"
          >菜单</van-tabbar-item
        >
        <van-tabbar-item
          replace
          icon="goods-collect-o"
          to="/shopcart"
          :badge="shopcartnum > 0 ? shopcartnum : ''"
        >
          购物袋</van-tabbar-item
        >
        <van-tabbar-item replace icon="contact" to="/mine"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </div>
  </div>
</template>

<script>
import "../assets/less/main.less";

// 导入
import { mapState, mapMutations } from "vuex";

export default {
  name: "Main",

  data() {
    return {
      active: 0,
    };
  },
  computed: {
    // 解构
    ...mapState(["shopcartnum", "isLoadShopcartnum"]),
  },
  created() {
    //输出查看数量
    //console.log(this.shopcartnum);

    // 查询购物袋的商品数量
    this.refershopcartNum();
  },
  methods: {
    ...mapMutations(["changeShopcartnum", "changeIsLoadShopcartnum"]),

    // 获取购物袋的数量(不是商品的总数量)
    refershopcartNum() {
      if (this.isLoadShopcartnum) {
        // console.log("main 已经加载过了,不再请求");
        return;
      }

      let tokenString = this.$cookies.get("tokenString");
      //console.log(tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //请求方式
      this.axios({
        method: "get",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          //console.log(res.data.result); //当前购物车数量
          this.$toast.clear();

          // 没有登录
          if (res.data.code == 700) {
            return;
          }
          if (res.data.code === 8000) {
            // 提交changeShopbagCount的mutations
            this.changeShopcartnum(res.data.result);
            // console.log(this.shopcartnum);
            this.changeIsLoadShopcartnum(true);
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },
  },
};
</script>
