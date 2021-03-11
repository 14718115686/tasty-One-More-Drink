<template>
  <div class="buy">
    <!-- 头部导航 -->
    <van-nav-bar
      title="结算订单"
      left-text="返回"
      left-arrow
      @click-left="back()"
    />

    <!-- 选择地址 -->
    <div class="order">
      <div class="address">
        <div class="add-header">
          <div class="add" @click="showselAddressList">
            <div class="add-text">选择地址</div>
            <van-icon name="arrow" />
          </div>

          <div class="add-name">
            <div class="one">{{ currAddress.name }}</div>
            <div class="two">{{ currAddress.tel }}</div>
            <div class="three" v-if="currAddress.isDefault">默认</div>
          </div>

          <div class="address-msg">
            <div>
              {{ currAddress.address }}
            </div>
          </div>
        </div>
      </div>

      <!-- 订单信息 -->
      <div class="orderInfo">
        <div>
          <div class="order-head">订单信息</div>
        </div>

        <div class="order-list">
          <div
            class="shoplist"
            v-for="(item, index) in buyShopData"
            :key="index"
          >
            <!-- 图片 -->
            <div class="img">
              <img :src="item.small_img" alt="" />
            </div>

            <!-- 右边 -->
            <div class="shop-right">
              <div class="right-title">
                <div class="title">{{ item.name }}</div>
                <div class="kw">{{ item.rule }}</div>
              </div>
              <div class="yw-title">{{ item.enname }}</div>

              <div class="bottom">
                <div class="price">￥ {{ item.price }}</div>
                <div class="num">×{{ item.count }}</div>
              </div>
            </div>
          </div>

          <div class="clear footer">
            <div class="fl pro">
              共计<span>{{ proInfo.count }}</span
              >件商品
            </div>
            <div class="fr hej">
              合计 <span class="pro-price"> ￥{{ proInfo.total }}.00</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 登录按钮 -->
      <div class="login-box">
        <van-button type="primary" block round @click="buy"
          >立即结算</van-button
        >
      </div>

      <!-- 下拉框 -->
      <div>
        <van-popup is-link closeable position="bottom" v-model="isOpen">
          <div class="add-title">选择地址</div>
          <!-- 地址 -->
          <van-address-list
            v-model="chosenAddressId"
            :list="list"
            default-tag-text="默认"
            @add="newAddress"
            @select="selectAddress"
          />
        </van-popup>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/buy.less";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Buy",

  data() {
    return {
      // 显示和隐藏弹出框
      isOpen: false,

      // 选择地址的id
      chosenAddressId: "",

      // 地址列表
      list: [],

      //选择当前地址
      currAddress: {},

      //购物袋id
      sids: [],

      //需要购买的购物袋商品数据
      buyShopData: [],

      //商品总数量和总价
      proInfo: {
        count: 0,
        total: 0,
      },

      //需要购买的购物袋商品数据
      buyShopbagData: [],
    };
  },

  created() {
    //获取用户地址列表
    this.referaddressList();

    //截取查询参数
    this.sids = this.$route.query.sids.split("-");
    // console.log(sids);

    // 获取订单结算的购物袋商品数据
    this.ShopbagDataByBuy();
  },
  computed: {
    ...mapState([" shopcartnum"]),
  },

  methods: {
    ...mapMutations(["changeShopcartnum"]),
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 新增地址
    newAddress() {
      this.$router.push({ name: "NewAddress" });
    },

    // 跳转
    // collection() {
    //   this.$router.push({ name: "Order" });
    // },

    // 选择地址
    selectAddress(item) {
      // console.log(item);
      // console.log(index);
      this.isOpen = false;
      this.currAddress = item;
      this.chosenAddressId = item.id;
    },

    //显示选择地址列表
    showselAddressList() {
      this.isOpen = true;
    },

    //获取用户地址列表
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
          } else if (res.data.code === 20000) {
            //添加新增地址的属性  城市 城市 区 名字  (address 没有这个值就添加转换)
            res.data.result.map((v) => {
              v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;
              v.id = v.aid;
              v.isDefault = Boolean(v.isDefault); // 转换布尔值

              // 选择默认地址
              if (v.isDefault) {
                this.chosenAddressId = v.aid;
                this.currAddress = v;
              }
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

    //获取订单结算的购物袋商品数据
    ShopbagDataByBuy() {
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
        url: this.baseUrl + "/commitShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(this.sids),
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

          if (res.data.code === 50000) {
            if (res.data.result.length === 0) {
              return this.$router.push({ path: "/" });
            }
            res.data.result.forEach((v) => {
              this.proInfo.count += v.count;
              this.proInfo.total += v.count * v.price;
            });

            this.buyShopData = res.data.result;
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

    //结算订单
    buy() {
      //判断是否选择地址
      if (!this.currAddress.aid) {
        return this.$toast({
          message: "选择收货地址",
          forbidClick: true,
          duration: 1000,
        });
      }

      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      //获取参数
      let data = {
        appkey: this.appkey,
        tokenString,
        sids: JSON.stringify(this.sids),
        phone: this.currAddress.tel,
        address: this.currAddress.address,
        receiver: this.currAddress.name,
      };
      //console.log("data=>", data);

      this.axios({
        //请求方式
        method: "post",
        url: this.baseUrl + "/pay",
        data,
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
          } else if (res.data.code === 60000) {
            //修改vuex购物袋数量
            this.changeShopcartnum(this.shopcartnum - this.sids.length);

            //跳转到订单组件
            this.$router.push({ name: "Order" });
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
