<template>
<!-- 个人中心 -->
  <div class="account">
    <div>
      <van-nav-bar
        title="个人中心"
        left-text="返回"
        left-arrow
        @click-left="detclick"
      />
    </div>
    <Background>
      <div>
        <van-cell title="头像" :center="true">
          <div>
            <div class="user-img fr">
              <img class="img-auto " :src="userInfo.userImg" alt="" />
              <van-uploader class="uploader-box" :after-read="afterRead" />
            </div>
          </div>
        </van-cell>

        <van-cell title="用户id" :center="true">{{ userInfo.userId }}</van-cell>
        <van-cell title="手机号" :center="true">{{ userInfo.phone }}</van-cell>
        <van-cell title="昵称" :center="true">
          <van-field
            class="user-name"
            v-model="userInfo.nickName"
            placeholder="请输入昵称"
            maxlength="12"
            @change="gainNickname()"
          />
        </van-cell>

        <div class="desc-box">
          <van-field
            v-model="userInfo.desc"
            rows="2"
            autosize
            label="简介"
            type="textarea"
            maxlength="40"
            placeholder="请输入简介"
            show-word-limit
            input-align="right"
             @change="gainDesc()"
          />
        </div>
      </div>
    </Background>
  </div>
</template>

<script>
import "../assets/less/account.less";
import Background from "../components/Background.vue";
export default {
  name: "Account",

  data() {
    return {
      userInfo: {
        nickName: "",
        desc: "",
        phone: "",
        userId: "",
      },
    };
  },

  components: {
    Background,
  },
  created() {
    //获取个人资料
    this.gainpersonageData();
  },
  methods: {
    //   返回上一
    detclick() {
      this.$router.go(-1);
    },
    afterRead(file) {
      // 此时可以自行将文件上传至服务器
      console.log(file);
    },

    //获取个人资料
    gainpersonageData() {
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
        url: this.baseUrl + "/findAccountInfo",
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
          } else if (res.data.code == "B001") {
            let data = res.data.result[0];
            if (data.desc == "") {
              data.desc = "这个家伙很懒,什么都没有留下";
            }
            this.userInfo = data;
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

    //上传用户头像
    afterRead(file) {
      //console.log(file)
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
        url: this.baseUrl + "/updateAvatar",
        data: {
          appkey: this.appkey,
          tokenString,
          imgType: filetype, //图片类型
          serverBase64Img: base64,
        },
      })
        .then((res) => {
          console.log(res.data);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            //如果没有登录就返回登录页面
            return this.$router.push({ name: "Login" });
          } else if (res.data.code == "I001") {
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

    //修改昵称
    gainNickname() {
      //console.log(this.userInfo.nickName); //输出input查看名字
      if (!this.userInfo.nickName) {
        this.$toast("昵称不能为空");
      }

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
        url: this.baseUrl + "/updateNickName",
        data: {
          tokenString,
          appkey: this.appkey,
          nickName: this.userInfo.nickName,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            //如果没有登录就返回登录页面
            return this.$router.push({ name: "Login" });
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

    // 修改简介
    gainDesc() {
      //console.log(this.userInfo.nickName); //输出input查看名字
      if (!this.userInfo.desc) {
        this.$toast("简介不能为空");
      }

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
        url: this.baseUrl + "/updateDesc",
        data: {
          tokenString,
          appkey: this.appkey,
          desc: this.userInfo.desc,
        },
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            //如果没有登录就返回登录页面
            return this.$router.push({ name: "Login" });
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
