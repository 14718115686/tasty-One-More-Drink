<template>
  <div class="menu">
    <div class="menu-one">
      <div class="menu-sea">
        <van-search
          v-model="value"
          placeholder="请输入搜索关键词"
          @focus="searchFocus"
        />
        <!--  -->
      </div>

      <!-- 头部的导航 -->
      <div class="menu-list">
        <!-- 循环输出 -->
        <div
          class="menu-item"
          v-for="(item, index) in menuList"
          :key="index"
          @click="togMenu(index, item.type)"
        >
          <div class="item-one">
            <div class="icon-one">
              <img
                class="img-auto"
                :src="menuindex == index ? item.activeimg : item.imgactive"
                alt=""
              />
            </div>
            <div class="item-text" :class="{ active: menuindex == index }">
              {{ item.title }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 商品 -->
    <div class="menu-comm">
      <div
        class="clear commit-list"
        v-for="(item, index) in productData"
        :key="index"
        @click="lookDetail(item.pid)"
      >
        <div class="fl list-img">
          <img class="img-auto" :src="item.smallImg" alt="" />
        </div>
        <div class="fl">
          <div class="list-text">
            <div class="name">{{ item.name }}</div>
            <div>{{ item.enname }}</div>
          </div>
        </div>
        <div class="fl price">￥{{ item.price }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import "../assets/less/menu.less";
export default {
  name: "Menu",

  data() {
    return {
      value: "",
      menuindex: 0,

      // 构造数组
      menuList: [
        {
          title: "推荐",
          imgactive: require("../assets/images/tj.png"),
          activeimg: require("../assets/images/tj2.png"),
        },
        {
          title: "拿铁",
          imgactive: require("../assets/images/nt.png"),
          activeimg: require("../assets/images/nt2.png"),
        },
        {
          title: "咖啡",
          imgactive: require("../assets/images/cf.png"),
          activeimg: require("../assets/images/cf2.png"),
        },
        {
          title: "瑞纳冰",
          imgactive: require("../assets/images/bql.png"),
          activeimg: require("../assets/images/bql2.png"),
        },
        {
          title: "水果茶",
          imgactive: require("../assets/images/menu1.png"),
          activeimg: require("../assets/images/menu2.png"),
        },
      ],

      //商品数据
      productData: [],
    };
  },

  created() {
    // 获取商品类型
    this.gainTypes();
  },

  methods: {
    // 切换菜单的商品样式
    togMenu(index, type) {
      if (this.menuindex == index) {
        return;
      }
      this.menuindex = index;

      this.gainProfuctTypes(type);
    },

    // 获取商品类型
    gainTypes() {
      // let tokenString = this.$cookies.get("tokenString");

      // if (!tokenString) {
      //   console.log("浏览器token不存在");
      //   return this.$router.push({ name: "Login" });
      // }

      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });
      this.axios({
        //请求方式
        method: "get",
        url: this.baseUrl + "/type",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          //console.log(res.data.result); //查询新增的地址 code 20000
          this.$toast.clear();

          if (res.data.code === 400) {
            // 添加推荐
            let data = res.data.result;

            data.unshift({
              id: 0,
              type: "isHot",
              typeDesc: "推荐",
            });
            //console.log(data);  //输出5五个(包括新添加的)
            //

            this.menuList.map((v) => {
              // 判断  查找
              for (let i = 0; i < data.length; i++) {
                // title和data里面的值一样 就打断
                if (v.title == data[i].typeDesc) {
                  v.type = data[i].type;
                  break;
                }
              }
            });
            let type = this.menuList[this.menuindex].type;
            this.gainProfuctTypes(type);
            //console.log(type);
          }
          // console.log("this.menuList==>",this.menuList);
          // else {
          //   this.$toast({
          //     message: res.data.msg,
          //     forbidClick: true,
          //     duration: 1000,
          //   });
          // }
        })
        .catch((err) => {
          this.$toast.clear();
          console.log("err ==> ", err);
        });
    },

    //根据类型获取商品
    gainProfuctTypes(type) {
      // this.$toast.loading({
      //   message: "加载中...",
      //   forbidClick: true,
      //   duration: 0,
      // });

      let params = {
        appkey: this.appkey,
      };
      if (type == "isHot") {
        params.key = "isHot";
        params.value = 1;
      } else {
        params.key = "type";
        params.value = type;
      }

      //console.log("params==>", params);

      this.axios({
        //请求方式
        method: "get",
        url: this.baseUrl + "/typeProducts",
        params,
      })
        .then((res) => {
          // console.log("res==>", res); //查询新增的地址 code 20000
          this.$toast.clear();

          if (res.data.code === 500) {
            this.productData = res.data.result;
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

    // 查看商品详情
    lookDetail(pid){
      // 传pid 查看商品详情
      this.$router.push({name:"Details" , params:{pid}})

    } ,

    //搜索获取焦点
    searchFocus(){
      this.$router.push({name:"Search"})
    }
  },
};
</script>
