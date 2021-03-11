<template>
  <div class="login">
    <!-- 头部 在组件Nav中-->
    <Nav />

    <!-- 中间文字 -->
    <div class="header">
      <div class="text">找回密码!!!</div>
      <div class="ying">find back the password</div>
    </div>

    <div class="form" v-show="!isNext">
      <van-cell-group>
        <van-field v-model="user.email" label="邮箱" placeholder="请输入邮箱" />
        <van-field
          v-model="user.code"
          label="验证码"
          placeholder="验证码(6位)"
          max-length="6"
        >
          <template #button>
            <van-button
              size="small"
              color="#00a862"
              :disabled="isSend"
              @click="gainEmali"
              >{{ text }}</van-button
            >
          </template>
        </van-field>
      </van-cell-group>

      <div class="forget" @click="gainHome">已有账号~立即登录?</div>

      <!-- 登录按钮 -->
      <div class="btn-box">
        <van-button plain block size="small" round color="#00a862" @click="next"
          >下一步
        </van-button>
      </div>
    </div>

    <!-- 登录/注册表单 -->
    <div class="form" v-show="isNext">
      <van-cell-group>
        <van-field
          v-model="user.phone"
          label="手机号"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="user.password"
          :type="isOpen ? 'password' : 'text'"
          label="新密码"
          placeholder="请输入新密码"
          :right-icon="isOpen ? 'closed-eye' : 'eye-o'"
          @click-right-icon="cutType"
        />
      </van-cell-group>

      <div class="forget">已有账号~立即登录?</div>

      <!-- 登录按钮 -->
      <div class="btn-box">
        <van-button
          plain
          block
          size="small"
          round
          color="#00a862"
          @click="commit()"
          >提交</van-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/login.less";
// 组件
import Nav from "../components/Nav.vue";
// 引入正则验证码js  (导入)
import { utils } from "../assets/js/utils";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  data() {
    return {
      //用户登录信息
      user: {
        phone: "",
        password: "",
        email: "",
        code: "",
      },

      //是否下一步
      isNext: false,

      //   是否发送
      isSend: false,

      //是否显示密码
      isOpen: true,

      //   文本内容
      text: "发送验证码",
    };
  },

  created() {
    this.changeShopcartnum(0);
    this.changeIsLoadShopcartnum(false);
  },

  components: {
    //   组件
    Nav,
  },
  methods: {
    ...mapMutations(["changeShopcartnum", "changeIsLoadShopcartnum"]),

    //跳转
    gainHome() {
      this.$router.push({ name: "Login" });
    },

    // 切换密码输入框
    cutType() {
      this.isOpen = !this.isOpen;
    },

    //下一步
    next() {
      let o = {
        //   用正则函数判断 用户 手机号码,密码
        email: {
          value: this.user.email,
          reg: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
          errorMsg: "邮箱格式不正确",
        },
        code: {
          value: this.user.code,
          reg: /^[A-Za-z\d]{6}$/,
          errorMsg: "验证码格式不正确",
        },
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }

      //发起获取验证码请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      //请求方式(新增地址)
      this.axios({
        method: "post",
        url: this.baseUrl + "/checkValidCode",
        data: {
          appkey: this.appkey,
          validCode: this.user.code,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          // 判断是否是
          if (res.data.code === "K001") {
            this.isNext = true;
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
          console.log("err==>", err);
        });
    },

    //获取邮箱验证码
    gainEmali() {
      let time = 60;

      this.isSend = true;

      this.text = `${time}秒后重新发送`;

      let timer = setInterval(() => {
        if (time <= 0) {
          clearInterval(timer);
          timer = null;
          time = 60;
          this.isSend = false;
        } else {
          time--;
          this.text = `${time}秒后重新发送`;
        }
      }, 1000);

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
        method: "post",
        url: this.baseUrl + "/emailValidCode",
        data: {
          appkey: this.appkey,
          email: this.user.email,
        },
      })
        .then((res) => {
          // console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 2000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === "J001") {
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


    //提交
    commit() {
      let o = {
        //   用正则函数判断 用户 手机号码,密码
        phone: {
          value: this.user.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: this.user.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码支持字母数字_组合且首字符必须为字母",
        },
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }

      //发起登录请求
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // console.log(this.user)

      //注册接口
      this.axios({
        //请求方式
        method: "post",
        url: this.baseUrl + "/retrievePassword",
        data: {
          // 是POST请求，参数需要挂载到data
          appkey: this.appkey,
          phone: this.user.phone,
          password: this.user.password,
        },
      })
        .then((res) => {
          //console.log(res); //输出查看 登录信息

          this.$router.push({ name: "Login" });

          this.$toast.clear();
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },
  },
};
</script>
