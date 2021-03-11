<template>
  <div class="mine">
    <!-- 背景 -->
    <div
      class="mine-bj"
      :style="{ backgroundImage: `url('${userInfo.userBg}')` }"
    >
      <van-uploader class="afterRead" :after-read="afterRead" />
    </div>

    <div class="mine-one">
      <div class="mine-head">
        <div class="clear">
          <!-- 头像 -->
          <div class="fl mine-tx">
            <img class="img-auto" :src="userInfo.userImg" alt="" />
          </div>

          <div class="fl user-box">
            <div class="user-name">{{ userInfo.nickName }}</div>
            <div class="mine-mes">
              {{
                userInfo.desc == ""
                  ? "这个家伙很懒,什么也没有写"
                  : userInfo.desc
              }}
            </div>
          </div>
        </div>

        <!-- 用户信息列表 -->
        <div class="mine-list">
          <van-cell-group>
            <van-cell
              v-for="(item, index) in listData"
              :key="index"
              :title="item.title"
              is-link
              @click="gainpage(item.name)"
            />
          </van-cell-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/mine.less";
export default {
  name: "Mine",

  data() {
    return {
      listData: [
        {
          title: "个人资料",
          name: "Account",
        },
        {
          title: "我的订单",
          name: "Order",
        },
        {
          title: "我的收藏",
          name: "Like",
        },
        {
          title: "收货地址",
          name: "AddressList",
        },
        {
          title: "安全中心",
          name: "Secure",
        },
      ],

      //用户信息
      userInfo: {},
    };
  },

  created() {
    this.gainUserData();
  },

  methods: {
    //跳转页面
    gainpage(name) {
      this.$router.push({ name });
    },

    //获取用户信息
    gainUserData() {
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

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            //如果没有登录就返回登录页面
            return this.$router.push({ name: "Login" });
          } else if (res.data.code == "A001") {
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

    //上传背景
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      // console.log(file);
      //   可以上传的文件类型
      let type = ["gif", "png", "jpg", "jpeg"];

      // 文件大小(1MB)
      let size = 1;

      // 判断文件允许类型
      let filetype = file.file.type.split("/")[1];
      if (type.indexOf(filetype) === -1) {
        this.$toast(`文件类型只支持${type.join(",")}`);
        return;
      }

      //判断文件大小
      let filesize = file.file.size / 1024 / 1024;
      // console.log( filesize)
      if (filesize > size) {
        this.$toast(`文件允许最大不能超过${size}MB`);
        return;
      }

      //处理base64的标记data:image/jpeg;base64,
      let base64 = file.content.replace(/^data:image\/[A-Za-z]+;base64,/, "");

      // console.log(base64);

      //发起请求
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

      //请求方式(新增地址)
      this.axios({
        method: "post",
        url: this.baseUrl + "/updateUserBg",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: filetype, //图片类型
          serverBase64Img: base64,
        },
      })
        .then((res) => {
          // console.log(res.data);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            //如果没有登录就返回登录页面
            return this.$router.push({ name: "Login" });
          } else if (res.data.code == "H001") {

            // console.log(res.data.userBg);
            // 赋值
            this.userInfo.userBg = res.data.userBg;
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
  },
};
</script>
