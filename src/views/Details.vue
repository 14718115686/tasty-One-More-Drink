<template>
  <div class="details">
    <!-- 商品详情的头部 -->
    <div>
      <van-nav-bar
        title="商品详情"
        left-text="返回"
        left-arrow
        @click-left="detclick"
      />
    </div>

    <!-- 图片 -->
    <div class="det-img">
      <img class="img-auto" :src="detailsData.large_img" alt="" />
    </div>

    <div class="det-box">
      <!-- 标题 -->
      <div class="det-title">
        <div class="det-name">
          <div class="name-title">{{ detailsData.name }}</div>
          <div class="name-title2">{{ detailsData.enname }}</div>
        </div>
        <div class="det-price">￥{{ detailsData.price }}</div>
      </div>

      <!-- 选择 -->
      <div class="options">
        <div
          class="option"
          v-for="(t1, i1) in detailsData.optionData"
          :key="i1"
        >
          <div class="opt-title">{{ t1.title }}</div>

          <div class="opt-list">
            <div
              :class="{ active: t1.currentIndex === i2 }"
              v-for="(t2, i2) in t1.option"
              :key="i2"
              @click="selectOption(t1, i2)"
            >
              {{ t2.title }}
            </div>
          </div>
        </div>
      </div>

      <!-- 数量 -->
      <div class="number">
        <div class="num-list">
          <div>选择数量</div>
          <div class="num">
            <van-stepper
              v-model="count"
              theme="round"
              button-size="22"
              disable-input
            />
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="describe">
        <div class="des-title">商品描述</div>
        <div
          class="desc"
          v-for="(item, index) in detailsData.desc"
          :key="index"
        >
          {{ index + 1 }}.{{ item }}
        </div>
      </div>

      <!-- 底部导航  -->
      <van-goods-action>
        <van-goods-action-icon
          icon="goods-collect"
          text="购物袋"
          color="323233"
          :badge="shopcartnum > 0 ? shopcartnum : ''"
          @click="skipshop"
        />

        <!--  -->
        <van-goods-action-icon
          icon="like"
          :text="collectTb ? '已收藏' : '收藏'"
          :color="collectTb ? '#00a862' : '#323233'"
          @click="collAndNotcoll()"
        />
        <van-goods-action-button
          color="#5ec89c"
          type="warning"
          text="加入购物袋"
          @click="addShop()"
        />
        <van-goods-action-button
          color="#00a862"
          type="danger"
          text="立即购买"
          @click="nowbuy()"
        />
      </van-goods-action>
    </div>
  </div>
</template>

<script>
import "../assets/less/details.less";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Details",

  data() {
    return {
      detDate: [],

      pid: "",

      //商品详情数据
      detailsData: {},

      //收藏状态
      collectTb: false,

      //收藏状态
      shopTb: false,

      // 购物袋商品记录数量
      // shopcartcount: 0,

      // 选择的数量
      count: 1,
    };
  },

  created() {
    //商品的id
    this.pid = this.$route.params.pid;
    // console.log(this.pid);

    // 查询购物袋的商品数量
    this.refershopcartNum();

    this.comdetailsData();

    // 查询收藏状态
    this.refercollect();

    
  },
  computed: {
    // 模型
    ...mapState(["shopcartnum", "isLoadShopcartnum"]),
  },

  methods: {
    // 方法
    ...mapMutations(["changeShopcartnum", "changeIsLoadShopcartnum"]),

    // 点击购物袋图标 跳转到购物袋
    skipshop() {
      this.$router.push({ name: "Shopcart" });
    },

    //   点击返回按钮上一页
    detclick() {
      this.$router.go(-1);
      // console.log(222);
    },

    // 点击立即购买 跳转到购物袋
    nowbuy() {
      this.$router.push({ name: "Shopcart" });
      // console.log(55)
    },

    // 商品详情数据
    comdetailsData() {
      // 加载插件
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      // 请求数据
      this.axios({
        method: "get",
        url: this.baseUrl + "/productDetail",
        params: {
          appkey: this.appkey,
          pid: this.pid,
        },
      })
        .then((res) => {
          //   console.log(res);
          this.$toast.clear();

          //判断是否存在
          if (res.data.code === 600) {
            let data = res.data.result[0];
            // console.log(data);

            //处理result里面的内容(口味)
            let options = ["cream", "milk", "sugar", "tem"];

            //保存处理的数据
            data.optionData = [];

            //循环
            options.forEach((o) => {
              // 如果不存在就不需要添加口味 data.optionData
              if (!data[o]) {
                return;
              }

              //以"/" 裁切口味 例如:全糖/半糖
              let optionTaste = data[o].split("/");

              // 口味+后面的选择
              let currenOpt = {
                title: data[o + "_desc"],
                currentIndex: 0,
                option: [],
              };
              // 口味的标题
              optionTaste.forEach((item) => {
                let k = {
                  title: item,
                };
                currenOpt.option.push(k);
              });

              data.optionData.push(currenOpt);
            });

            //处理商品描述信息
            data.desc = data.desc.split(/\n/); //换行
            // console.log(data);

            this.detailsData = data;
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

    // 选择口味的高亮
    selectOption(item, index) {
      // 如果点击了相同的口味选择option  就返回
      if (item.currentIndex === index) {
        return;
      }
      //   点击高亮
      item.currentIndex = index;
    },

    // 收藏或者取消收藏
    collAndNotcoll() {
      if (this.collectTb) {
        //取消
        this.notcollect();
      } else {
        //收藏
        this.collect();
      }
    },

    //收藏
    collect() {
      //查看浏览器是否存在
      let tokenString = this.$cookies.get("tokenString");
      //console.log( tokenString);

      // 判断  要登录才可以  如果不存在就返回登录页面 login
      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 请求收藏地址
      this.axios({
        //请求方式
        method: "post",
        url: this.baseUrl + "/like",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((res) => {
          // console.log(res); //code 已收藏 800
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          // 判断是否是800 已收藏
          if (res.data.code === 800) {
            //已收藏 图标和文字
            this.collectTb = true;
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

    // 查询当前收藏商品
    refercollect() {
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
        url: this.baseUrl + "/findlike",
        params: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
        },
      })
        .then((res) => {
          //console.log(res);
          this.$toast.clear();
          if (res.data.code == 700) {
            return;
          }
          if (res.data.code === 1000) {
            if (res.data.result.length > 0) {
              this.collectTb = true;
            }
          }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //取消收藏
    notcollect() {
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
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
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
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 900) {
            if (res.data.result === 1) {
              //取消收藏 图标和文字
              this.collectTb = false;
            }
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

    // 添加购物袋
    addShop() {
      // console.log(this.detailsData);
      // console.log(this.count);
      // return;

      //查看浏览器是否存在
      let tokenString = this.$cookies.get("tokenString");
      //console.log( tokenString);

      // 判断  要登录才可以  如果不存在就返回登录页面 login
      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      // 创建一个口味的空数组
      let taste = [];
      this.detailsData.optionData.forEach((v) => {
        taste.push(v.option[v.currentIndex].title);
      });
      //console.log(taste);  //输出口味

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 请求添加购物车地址
      this.axios({
        //请求方式
        method: "post",
        url: this.baseUrl + "/addShopcart",
        data: {
          appkey: this.appkey,
          pid: this.pid,
          tokenString,
          count: this.count,
          rule: taste.join("/"), //用 / 拼接
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
            return this.$router.push({ name: "Login" });
          }

          // 判断是否是800
          if (res.data.code === 3000) {
            if (res.data.status === 1) {
              // ++this.shopcartnum;
              //新增数据
              //提交mutations修改购物袋
              this.changeShopcartnum(this.shopcartnum + 1);

              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 1000,
              });
            }
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

    // 获取购物袋是数量(不是商品总数量)
    refershopcartNum() {
      if (this.isLoadShopcartnum) {
        // console.log("Detail 已经加载过购物袋数量, 不再请求");
        return;
      }

      let tokenString = this.$cookies.get("tokenString");
      // console.log("tokenString ==> ", tokenString);

      if (!tokenString) {
        console.log("浏览器token不存在");
        return;
      }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      this.axios({
        //请求方式
        method: "get",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          // console.log( res);
          this.$toast.clear();

          //没有登录
          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 8000) {
            //提交changeShopcartnum的mutations
            this.changeShopcartnum(res.data.result);
            // console.log('this.shopcartnum ==> ', this.shopcartnum);
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
