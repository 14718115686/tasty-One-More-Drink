<template>
  <div class="home">
    <!-- 头部导航  -->
    <div class="header">
      <van-nav-bar>
        <template #left>
          <div class="header-title">
            <div class="header-time">{{greetText}}</div>
            <div class="header-name">{{ userInfo.nickName }}</div>
          </div>
        </template>

        <template #right>
          <div class="seacher">
            <van-search
              v-model="value"
              placeholder="请输入商品名称"
              @focus="searchFocus"
            />
            <!--  -->
          </div>
        </template>
      </van-nav-bar>
    </div>

    <!-- 轮播图 -->
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="1000" indicator-color="#00a862">
        <van-swipe-item v-for="item in bannDate" :key="item.id">
          <img :src="item.bannerImg" @click="bannerdetails(item.pid)" />
          <div class="banner-text">{{ item.name }}</div>
        </van-swipe-item>
      </van-swipe>
    </div>

    <!-- 热门推荐 -->
    <div class="hotRecommend clear">
      <div class="hot-title">
        <div class="hot-text">热卖推荐</div>
      </div>

      <!-- 热热卖推荐的组件 -->
      <Commodity
        v-for="(list, index) in hotDate"
        :key="index"
        :commodity="list"
      >
        <template #hot>
          <div class="hot-list">
            <div class="hot-icon">hot</div>
          </div>
        </template>
      </Commodity>
    </div>
  </div>
</template>

<script>
import "../assets/less/home.less";
import Commodity from "../components/Commodity";
export default {
  name: "Home",
  components: {
    Commodity,
  },

  data() {
    return {
      value: "",

      //轮播图数据
      bannDate: [],

      // 热卖推荐
      hotDate: [],

      // 用户信息
      userInfo:{},

      //获取时间
      greetText:"",
    };
  },
  created() {
    // 获取 轮播图数据
    this.BannerDate();
    // 获取热卖 推荐商品
    this.hotCommodity();

    // 查询用户信息
    this.gainUserData();

    this.getCurrenTime();
  },

  methods: {
    //点击查看商品详情
    bannerdetails(pid) {
      this.$router.push({ name: "Details", params: { pid } });
      // console.log(555)
    },

    //获取轮播图数据
    BannerDate() {
      // 加载插件
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 请求数据
      this.axios({
        method: "get",
        url: this.baseUrl + "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          //console.log(res); //data > result > bannerImg
          this.$toast.clear();

          //判断是否存在
          if (res.data.code === 300) {
            this.bannDate = res.data.result;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

    // 热卖推荐的商品
    hotCommodity() {
      // 加载插件
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      // 请求数据
      this.axios({
        method: "get",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          //判断是否存在
          if (res.data.code === 500) {
            this.hotDate = res.data.result;
          } else {
            this.$toast({
              message: res.daata.msg,
              forbidClick: true,
              duration: 1000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
        });
    },

     //获取用户信息
    gainUserData() {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //请求方式(新增地址)
      this.axios({
        method: "get",
        url: this.baseUrl + "/findMy",
        params: {
          tokenString,
          appkey: this.appkey,
        },
      })
        .then((res) => {
          //console.log(res);
          this.$toast.clear();
           if (res.data.code == "A001") {
            this.userInfo = res.data.result[0];
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 1000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //搜索获取焦点
    searchFocus(){
      this.$router.push({name:"Search"})
    },

    // 获取时间
    getCurrenTime(){
      let current_hour = new Date().getHours();
       if(current_hour >= 1 && current_hour < 6){
        this.greetText = "晚间好!"
      }else if(current_hour >= 6 && current_hour < 12){
        this.greetText = "早上好!"
      }else if(current_hour >= 12 && current_hour < 18){
        this.greetText = "下午好!"

      }else if(current_hour >= 18 && current_hour < 24){
        this.greetText = "晚上好!"
      }
    }
  },
};
</script>
