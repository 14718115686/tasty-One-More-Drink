<template>
<!-- 地址列表 -->
  <div class="address-list">
    <van-nav-bar
      title="地址列表"
      left-text="返回"
      left-arrow
      @click-left="back()"
    ></van-nav-bar>

    <Background>
      <div v-if="list.length > 0">
      <van-address-list
        :list="list"
        default-tag-text="默认"
        :switchable="false"
        @add="add"
        @edit="edit"
      />
      </div>

      <div v-else>
        <van-empty description="没有地址数据" ></van-empty>
      </div>
    </Background>
  </div>
</template>

<script>
import "../assets/less/addresslist.less";
import Background from "../components/Background.vue";
export default {
  name: "AddressList",

  data() {
    return {
      // 地址列表数据
      list: [
        // {
        //   id: "1",
        //   name: "张三",
        //   tel: "13000000000",
        //   address: "浙江省杭州市西湖区文三路 138 号东方通信大厦 7 楼 501 室",
        //   isDefault: true,
        // },  //模板
        //
      ],
    };
  },
  created() {
    this.referaddressList();
  },
  components: {
    Background,
  },

  methods: {
    //   返回上一级
    back() {
      this.$router.go(-1);
    },

    // 跳转到新增地址
    add() {
      this.$router.push({ name: "NewAddress" });
    },

    //编辑
    edit({ aid }) {
      this.$router.push({ name: "NewAddress", params: { aid } });
    },

    //查询用户地址列表
    referaddressList() {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        //请求方式
        method: "get",
        url: this.baseUrl + "/findAddress",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          //console.log(res); //查询新增的地址 code 20000
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            //如果没有登录就跳转到登录页面
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 20000) {
            //添加新增地址的属性  城市 城市 区 名字  (address 没有这个值就添加转换)
            res.data.result.forEach((v) => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              v.isDefault = Boolean(v.isDefault); // 转换布尔值
            });

            this.list = res.data.result;
            //console.log(res.data.result); //查看
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
          console.log("err ==> ", err);
        });
    },
  },
};
</script>
