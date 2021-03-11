<template>
  <div class="login">
    <!-- 头部 在组件Nav中-->
    <Nav />

    <!-- 中间文字 -->
    <div class="header">
      <div class="text">欢迎回来!</div>
      <div class="ying">Please login to your accounts</div>
    </div>

    <!-- 登录/注册表单 -->
    <div class="form">
      <van-cell-group>
        <van-field
          v-model="user.phone"
          label="手机号"
          placeholder="请输入手机号"
        />
        <van-field
          v-model="user.password"
          :type="isOpen ? 'password' : 'text'"
          label="密 码"
          placeholder="请输入密码"
          :right-icon="isOpen ? 'closed-eye' : 'eye-o'"
          @click-right-icon="cutType"
        />
      </van-cell-group>

      <div class="forget" @click="gian()">忘记密码?</div>

      <!-- 登录按钮 -->
      <div class="btn-box">
        <van-button
          plain
          block
          size="small"
          round
          color="#00a862"
          @click="login"
          >登录</van-button
        >
        <!-- 注册按钮 -->
        <van-button
          class="reg"
          type="default"
          plain
          block
          size="small"
          round
          color="#5e5f61"
          @click="popupsOpen"
          >注册
        </van-button>
      </div>

      <!-- 上拉框 -->
      <van-popup
        v-model="isshow"
        position="bottom"
        :style="{ height: '40%' }"
        closeable
        round
      >
        <!-- 注册弹出框 -->
        <div class="popups">
          <div class="register-text">注 册</div>
          <!-- 弹出层盒子 -->
          <div class="popups-box">
            <van-field
              v-model="popupsUser.phone"
              label="手机号"
              placeholder="请输入手机号注册(11位)"
            />
            <van-field
              v-model="popupsUser.name"
              label="名 字"
              placeholder="请输入名字(1-10位)"
            />
            <van-field
              v-model="popupsUser.password"
              :type="isOpen ? 'password' : 'text'"
              label="密 码"
              placeholder="请输入密码(6-16位)"
              :right-icon="isOpen ? 'closed-eye' : 'eye-o'"
              @click-right-icon="cutType"
            />
          </div>

          <!-- 弹出框的注册按钮 -->
          <div class="reg-box">
            <van-button
              type="default"
              plain
              block
              size="small"
              round
              color="#00a862"
              @click="register"
              >注册
            </van-button>
          </div>
        </div>
      </van-popup>
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
      },

      //是否显示弹出层
      isshow: false,
      //是否显示密码
      isOpen: true,

      //   下拉框的用户注册信息
      popupsUser: {
        phone: "",
        password: "",
        name: "",
      },
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

    //显示下拉框
    popupsOpen() {
      this.isshow = true;
    },

    //跳转页面
    gian(){
      this.$router.push({name:"Forget"})
    },

    // 点击注册 触发正则
    register() {
      let o = {
        //   用正则函数判断 手机号码,密码,名字
        phone: {
          value: this.popupsUser.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        name: {
          value: this.popupsUser.name,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
        password: {
          value: this.popupsUser.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      }

      //发起注册请求(懒加载)
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //注册接口
      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/register",
        data: {
          // 是POST请求，参数需要挂载到data
          appkey: this.appkey,
          phone: this.popupsUser.phone,
          nickName: this.popupsUser.name,
          password: this.popupsUser.password,
        },
      })
        .then((res) => {
          //console.log(res); //输出查看 注册信息
          this.$toast.clear();
          if (res.data.code == 100) {
            //关闭注册弹出层
            this.isshow = false;
            //清除用户注册信息
            for (let key in this.popupsUser) {
              this.popupsUser[key] = "";
            }
          } else {
            this.$toast.loading({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    //登录
    login() {
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
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
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
        method: "POST",
        url: this.baseUrl + "/login",
        data: {
          // 是POST请求，参数需要挂载到data
          appkey: this.appkey,
          phone: this.user.phone,
          password: this.user.password,
        },
      })
        .then((res) => {
          console.log(res); //输出查看 登录信息
          this.$toast.clear();
          //登录成功 存储token, 用于下次访问有关于用户信息界面的登录标记
          if (res.data.code == 200) {
            this.$cookies.set("tokenString", res.data.token, "1d");

            //跳转到其他页面
            this.$router.push({ name: "Home" });
          } else {
            this.$toast.loading({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log(err);
        });
    },

    // 切换密码输入框
    cutType() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>
