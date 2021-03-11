<template>
  <div class="secure">
    <div>
      <van-nav-bar
        title="安全中心"
        left-text="返回"
        left-arrow
        @click-left="detclick"
      />
    </div>

    <Background>
      <div class="cell-box">
        <van-cell
          title="修改密码"
          is-link
          :center="true"
          @click="isOpen = true"
        />
        <van-cell
          title="注销账号"
          is-link
          :center="true"
          @click="closeAccount"
        />
      </div>
    </Background>

    <div class="but-box">
      <van-button color="#00a862" block round @click="closeLogin"
        >退出登录</van-button
      >
    </div>

    <van-popup is-link position="bottom" closeable v-model="isOpen">
      <div class="changepassword-box">
        <div class="changepassword">修改密码</div>

        <div>
          <van-field
            v-model="user.oldPassword"
            :type="isPassword ? 'password' : 'text'"
            name="旧密码"
            label="旧密码"
            placeholder="请输入旧密码(6-16位)"
            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
            @click-right-icon="cutType"
          />

          <van-field
            v-model="user.newPassword"
            :type="isPassword ? 'password' : 'text'"
            name="新密码"
            label="新密码"
            placeholder="请输入密码(6-16位)"
            :right-icon="isPassword ? 'closed-eye' : 'eye-o'"
            @click-right-icon="cutType"
          />

          <div class="commit-but">
            <van-button color="#00a862" block round @click="commitPassword()"
              >提交</van-button
            >
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import Background from "../components/Background.vue";
import { utils } from "../assets/js/utils";

export default {
  name: "Secure",

  data() {
    return {
      // 显示隐藏上拉框
      isOpen: false,
      //   显示隐藏密码
      isPassword: true,
      user: {
        oldPassword: "",
        newPassword: "",
      },
    };
  },

  components: {
    Background,
  },

  methods: {
    //返回上一级
    detclick() {
      this.$router.go(-1);
    },
    cutType() {
      this.isPassword = !this.isPassword;
    },

    //注销账号
    closeAccount() {
      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否注销账号,一旦注销无法恢复!!!",
          confirmButtonColor: "#00a862",
        })
        .then(() => {
          //执行账号注销
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
            url: this.baseUrl + "/destroyAccount",
            data: {
              tokenString,
              appkey: this.appkey,
             
            },
          })
            .then((res) => {
              console.log(res); //查看结果
              this.$toast.clear();

              if (res.data.code == 700) {
                //如果没有登录就返回登录页面
                return this.$router.push({ name: "Login" });
              } else if (res.data.code == "G001") {
                setTimeout(() => {
                  //清除登录状态
                  localStorage.removeItem("tokenString");
                  this.$router.push({ name: "Login" });
                }, 800);

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
        })
        
    },

    //退出登录
    closeLogin() {
      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否确定退出登录!",
          confirmButtonColor: "#00a862",
        })
        .then(() => {
          //执行退出登录
          //清除登录状态

          this.$toast.loading({
            message: "加载中...",
            forbidClick: true,
            duration: 0,
          });
          this.$toast.clear();
          localStorage.removeItem("tokenString");
          return this.$router.push({ name: "Login" });
        })
        .catch((err) => {
          console.log("err ==> ", err);
        });
    },

    //提交修改密码
    commitPassword() {
      let o = {
        //   用正则函数判断 用户 手机号码,密码

        oldPassword: {
          value: this.user.oldPassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "旧密码格式不正确",
        },
        newPassword: {
          value: this.user.newPassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码格式不正确",
        },
      };

      //验证表单
      let isPassword = utils.validForm(o);

      //表单验证不通过, 拦截注册请求
      if (isPassword) {
        // console.log("发起修改密码请求");

        if (this.user.newPassword == this.user.oldPassword) {
          this.$toast("新密码和旧密码不能一致");
          return;
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
          url: this.baseUrl + "/updatePassword",
          data: {
            tokenString,
            appkey: this.appkey,
            password: this.user.newPassword,
            oldPassword: this.user.oldPassword,
          },
        })
          .then((res) => {
            console.log(res); //查看结果
            this.$toast.clear();

            if (res.data.code == 700) {
              //如果没有登录就返回登录页面
              return this.$router.push({ name: "Login" });
            } else if (res.data.code == "E001") {
              setTimeout(() => {
                //清除登录状态
                localStorage.removeItem("tokenString");
                this.$router.push({ name: "Login" });
              }, 800);

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
      }
    },
  },
};
</script>

<style lang="less" scoped>
.secure {
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar__arrow {
    color: #00a862;
  }

  /deep/ .cell-box .van-cell {
    padding: 0;
    height: 45px;
  }

  /deep/ .cell-box .van-cell {
    border-bottom: 1px solid #e8e8e8;
    padding: 15px;
    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: transparent;
    }
  }

  .but-box {
    margin-top: 90px;
    padding: 0 10px;
  }

  .changepassword-box {
    padding: 15px;
  }

  .changepassword {
    margin-bottom: 40px;
    font-size: 15px;
    color: #202124;
    letter-spacing: 1px;
  }

  .commit-but {
    margin: 30px 0 20px;
  }
}
</style>
