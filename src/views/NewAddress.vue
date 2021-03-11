<template>
  <div class="newaddress">
    <van-nav-bar
      :title="aid ? '编辑地址' : '新增地址'"
      left-text="返回"
      left-arrow
      @click-left="back()"
    ></van-nav-bar>

    <Background>
      <div class="address">
        <van-address-edit
          :area-list="areaList"
          show-postal
          :show-delete="!!aid"
          show-set-default
          show-search-result
          :detail-maxlength="30"
          :area-columns-placeholder="['请选择', '请选择', '请选择']"
          :address-info="originAddressInfo"
          @save="save"
          @delete="removeAddress"
        />
      </div>
    </Background>
  </div>
</template>

<script>
// 引入地区
import Background from "../components/Background.vue";
import "../assets/less/newaddress.less";
import areaList from "../assets/js/area";

export default {
  name: "NewAddress",
  data() {
    return {
      //省市区数据
      areaList,

      // 编辑地址的aid
      aid: "",

      //编辑地址的初始化
      originAddressInfo: {},
    };
  },
  components: {
    Background,
  },

  created() {
    //截取路由参数
    this.aid = this.$route.params.aid;
    // console.log(this.$route.params.aid); //undefind

    // 如果存在aid,就根据aid查询
    if (this.aid) {
      this.newAddressAid();
    }
  },

  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    // 新增地址
    add(value) {
      let tokenString = this.$cookies.get("tokenString");

      if (!tokenString) {
        console.log("浏览器token不存在");
        return this.$router.push({ name: "Login" });
      }

      //复制value(输入新增地址的数据)
      let data = {
        ...value,
        tokenString,
        appkey: this.appkey,
      };
      // console.log(data);

      // 转换数字类型
      data.isDefault = Number(data.isDefault);
      // console.log( data.isDefault)
      delete data.country; //把空的country删除

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      //请求方式(新增地址)
      this.axios({
        method: "post",
        url: this.baseUrl + "/addAddress",
        data,
      })
        .then((res) => {
          console.log(res);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            //如果没有登录就返回登录页面
            return this.$router.push({ name: "Login" });
          }

          //如果添加成功, 跳回地址列表组件
          if (res.data.code === 9000) {
            this.$router.push({ name: "AddressList" });
          }

          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //编辑地址
    edit(value) {
      // console.log(value);
      // console.log(this.originAddressInfo);

      let origin = this.originAddressInfo;

      let isEdit = false;
      //循环地址的每一项
      for (let key in origin) {
        if (origin[key] !== value[key]) {
          // 判断是否更改数据
          isEdit = true;
          break;
        }
      }

      if (isEdit) {
        //console.log("发起编辑请求");
        //编辑过的

        let tokenString = this.$cookies.get("tokenString");

        if (!tokenString) {
          console.log("浏览器token不存在");
          return this.$router.push({ name: "Login" });
        }

        // 复制一份value
        let address = {};
        // 拿到存在的

        address.aid = this.aid;
        address.name = value.name;
        address.tel = value.tel;
        address.province = value.province;
        address.city = value.city;
        address.county = value.county;
        address.addressDetail = value.addressDetail;
        address.areaCode = value.areaCode;
        address.postalCode = value.postalCode;
        address.isDefault = Number(value.isDefault);

        //输出编辑的内容
        //console.log(address);

        this.$toast.loading({
          message: "加载中...",
          forbidClick: true,
          duration: 0,
        });

        //请求方式(新增地址)
        this.axios({
          method: "post",
          url: this.baseUrl + "/editAddress",
          data: {
            appkey: this.appkey,
            tokenString,
            ...address, //复制的address
          },
        })
          .then((res) => {
            console.log(res);
            this.$toast.clear();

            if (res.data.code == 700) {
              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 3000,
              });
              //如果没有登录就返回登录页面
              return this.$router.push({ name: "Login" });
            }

            //如果添加成功, 跳回地址列表组件
            if (res.data.code === 30000) {
              this.$router.push({ name: "AddressList" });
            }

            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          })
          .catch((err) => {
            this.$toast.clear();
            console.log("err ==> ", err);
          });
      } else {
        //console.log("未编辑");
        // 跳转回地址列表
        this.$router.push({ name: "AddressList" });
      }
    },

    // 保存地址
    save(value) {
      if (this.aid) {
        //编辑地址
        this.edit(value);
      } else {
        //新增地址
        this.add(value);
      }
    },

    // 根据aid获取地址数据
    newAddressAid() {
      //查询地址
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

      //请求方式(根据地址aid查询地址接口)
      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
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
          }

          if (res.data.code === 40000) {
            let data = res.data.result[0];

            data.isDefault = !!data.isDefault;

            this.originAddressInfo = data;
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

    // 删除地址
    removeAddress(value) {
      // console.log(value);
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
        url: this.baseUrl + "/deleteAddress",
        data: {
          tokenString,
          appkey: this.appkey,
          aid: value.aid,
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
          }

          //如果添加成功, 跳回地址列表组件
          if (res.data.code === 10000) {
            this.$router.push({ name: "AddressList" });
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
