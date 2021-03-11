<template>
  <div class="shopcart">
    <!--购物袋的头部 -->
    <div>
      <van-nav-bar
        title="购物袋"
        left-text="返回"
        left-arrow
        @click-left="shopreturn()"
      >
        <template #right>
          <div @click="cutEdit" v-if="shopData.length > 0">
            {{ isEdit ? "完成" : "编辑" }}
          </div>
        </template>
      </van-nav-bar>
    </div>

    <div v-if="shopData.length > 0">
      <!-- 背景 -->
      <div class="back"></div>

      <!-- 购物袋商品 -->
      <div class="shopcomm">
        <div class="shopcomm2">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="哎呀,没有更多了"
            @load="loadshopData"
          >
            <van-swipe-cell
              :disabled="isEdit"
              v-for="(item, index) in shopData"
              :key="index.sid"
            >
              <div class="shop-box">
                <div class="abc">
                  <van-checkbox
                    v-model="item.isChecked"
                    @change="simpleSelect"
                  ></van-checkbox>
                </div>

                <!-- 右边样式 -->
                <div class="shoplist">
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
                      <div class="price">￥{{ item.price }}</div>
                      <div class="num">
                        <van-stepper
                          v-model="item.count"
                          theme="round"
                          button-size="22"
                          disable-input
                          @change="GainshopcartData(item.sid, item.count)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <template #right>
                <van-button
                  square
                  type="danger"
                  text="删除"
                  @click="removeShopbag([item.sid], index)"
                />
              </template>
            </van-swipe-cell>
          </van-list>
        </div>
      </div>

      <!-- 提交框 -->
      <div class="kuang">
        <van-submit-bar
          v-show="!isEdit"
          :price="total"
          button-text="提交订单"
          @submit="commit"
        >
          <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>

        <van-submit-bar
          v-show="isEdit"
          button-text="删除选择"
          @submit="removeSelect"
        >
          <van-checkbox v-model="checked" @click="allSelect">全选</van-checkbox>
        </van-submit-bar>
      </div>
    </div>

    <div v-else>
      <van-empty description="购物袋没有数据，赶紧去逛一逛！">
        <div class="shopping" @click="goHome">逛一逛</div>
      </van-empty>
    </div>
  </div>
</template>

<script>
import "../assets/less/shopcart.less";
import { mapState, mapMutations } from "vuex";

export default {
  name: "Shopcart",

  data() {
    return {
      // 是否编辑商品
      isEdit: false,
      // count: 7,
      
      // 是否全选
      checked: false,

      // 购物袋数据
      shopData: [],

      //购物袋所有的数据
      shopallData: [],

      // 是否加载()
      loading: true,

      //是否全部加载
      finished: false,

      // 开始截取的位置
      start: 0,

      //每次获取6条数据
      count: 6,

      //总金额
      total: 0,
    };
  },
  created() {
    this.shopcartData();
  },

  computed: {
    ...mapState(["shopcartnum"]),
  },

  methods: {
    ...mapMutations(["changeShopcartnum"]),

    goHome() {
      this.$router.push({ name: "Home" });
    },

    // 切换编辑完成状态
    cutEdit() {
      this.isEdit = !this.isEdit;
    },

    // 获取购物袋数据
    shopcartData() {
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
        method: "get",
        url: this.baseUrl + "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          //console.log(res.data); //输出购物车的所有数据
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          // 判断是否是
          if (res.data.code === 5000) {
            res.data.result.forEach((v) => {
              v.isChecked = false;
            });
            this.shopallData = res.data.result;

            //截取
            this.shopData = this.shopallData.slice(
              this.start,
              this.start + this.count
            );

            this.start += this.count;

            //判断不够6条的时候
            if (this.shopallData.length < this.count) {
              this.finished = true;
              return;
            }

            // 下次进行懒加载
            this.loading = false;
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

    //加载数据
    loadshopData() {
      setTimeout(() => {
        //截取购物袋所有的其中的6个
        let data = this.shopallData.slice(this.start, this.start + this.count);

        // console.log(data);  //输出6个对象

        this.shopData.push(...data);
        this.start += this.count;

        //如果最后一次截取不够this.count(6)数据,下次不可能有数据
        if (data.length < this.count) {
          this.finished = true;
          return;
        }

        //下次进行懒加载
        this.loading = false;
      }, 1000);
    },

    // 修改购物车数量
    GainshopcartData(sid, count) {
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
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid,
          count,
        },
      })
        .then((res) => {
          //console.log(res.data); //输出购物车的
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          // 判断是否是
          if (res.data.code === 6000) {
            this.sum();
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

    // 全选按钮
    allSelect() {
      // 将所有单选状态修改
      this.shopData.forEach((v) => {
        v.isChecked = this.checked;
      });

      this.sum();
    },

    //单选
    simpleSelect() {
      this.sum();

      //只要有一个单选没有勾选，则全选不能勾选
      for (let i = 0; i < this.shopData.length; i++) {
        if (!this.shopData[i].isChecked) {
          this.checked = false;
          return;
        }
      }

      this.checked = true;
    },

    //删除购物袋数据, 删除成功后, 记得修改vuex的购物袋数量
    removeShopbag(sids, index) {
      // this.shopData.splice(index, 1);

      let tokenString = this.$cookies.get("tokenString");
      // console.log("tokenString ==> ", tokenString);

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
        method: "POST",
        url: this.baseUrl + "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids: JSON.stringify(sids),
        },
      })
        .then((res) => {
          // console.log( res);

          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code == 7000) {
            //如果是单个
            if (index !== undefined) {
              this.shopData.splice(index, 1);

              this.changeShopcartnum(this.shopcartnum - 1);

              this.simpleSelect();
            } else {
              //执行多个删除
              for (let i = 0; i < this.shopData.length; i++) {
                if (this.shopData[i].isChecked) {
                  this.shopData.splice(i, 1);
                  i--;
                }
              }

              this.changeShopcartnum(this.shopcartnum - sids.length);
              this.sum();
            }
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

    //删除选择的购物袋商品
    removeSelect() {
      //获取勾选的sid
      let sids = [];
      this.shopData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: "未选择删除商品",
          forbidClick: true,
          duration: 1000,
        });

        return;
      }

      // console.log( sids); //输出商品id

      this.removeShopbag(sids);
    },

    //计算勾选的商品总金额
    sum() {
      let total = 0;
      this.shopData.forEach((v) => {
        if (v.isChecked) {
          total += v.price * v.count;
        }
      });

      this.total = total * 100;
    },

    

    //提交订单
    commit() {
      // console.log(555);
      let sids = [];
      this.shopData.forEach((v) => {
        if (v.isChecked) {
          sids.push(v.sid);
        }
      });

      if (sids.length === 0) {
        this.$toast({
          message: "选择购买的商品",
          forbidClick: true,
          duration: 1000, 
        });

        return;
      }

      // console.log( sids); //输出商品id

      //跳转到结算页面并带参数sids查询参数
      this.$router.push({ name: "Buy", query: { sids: sids.join("-") } });
    },

    // 返回上一级
    shopreturn() {
      this.$router.go(-1);
    },
  },
};
</script>
