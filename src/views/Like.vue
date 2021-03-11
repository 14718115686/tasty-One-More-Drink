<template>
  <div class="like">
    <div>
      <van-nav-bar
        title="我的收藏"
        left-text="返回"
        left-arrow
        @click-left="detclick"
      />
    </div>

    <Background>
      <div class="clear" v-if="likepor.length > 0">
        <div class="fl like-list" v-for="(item, index) in likepor" :key="index" @click="pordetails(item.pid)" >
          <!-- 接收事件 ProList-->
          <ProList :item = item @searchList="remomeLike(item.pid,index)" :is-remove = "true" > </ProList>
        </div>

        <!-- <div
          class="fl like-list "
          v-for="(item, index) in likepor"
          :key="index"
         
        >
          <div  @click="pordetails(item.pid)">
            <img class="img-auto" :src="item.smallImg" alt="" />
          </div>

          <div class="like-name">
            <div class="like-zwname">{{ item.name }}</div>
            <div class="like-ename">
              {{ item.enname }}
            </div>
            <div class="clear">
              <div class="fl like-price">￥{{ item.price }}</div>
              阻止冒泡
              <div class="fr like-del" @click="remomeLike(item.pid,index )">
                <van-icon name="delete-o" />
              </div>
            </div>
          </div>
        </div> -->
      </div>

      <div v-else>
        <van-empty description="没有收藏商品,你可以去收藏看一下" />
      </div>
    </Background>
  </div>
</template>

<script>
import "../assets/less/like.less";
import Background from "../components/Background.vue";
import ProList from "../components/ProList.vue";
export default {
  name: "Like",
  components: {
    Background,
    ProList,
  },

  data() {
    return {
      likepor: [],
    };
  },

  created() {
    this.gainLike();
  },

  methods: {
    // 返回上一级
    detclick() {
      this.$router.go(-1);
    },

    // 获取用户所有的收藏
    gainLike() {
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
        url: this.baseUrl + "/findAllLike",
        params: {
          tokenString,
          appkey: this.appkey,
        },
      })
        .then((res) => {
          //console.log(res.data.result);
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            //如果没有登录就返回登录页面
            return this.$router.push({ name: "Login" });
          } else if (res.data.code == 2000) {
            this.likepor = res.data.result;
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

    //查看商品详情
    pordetails(pid) {
      // console.log(pid);
      this.$router.push({ name: "Details", params: { pid } });
    },

    //删除收藏商品(得到id)
    remomeLike(pid, index) {
      console.log(pid);
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
        url: this.baseUrl + "/notlike",
        data: {
          appkey: this.appkey,
          pid,
          tokenString,
        },
      })
        .then((res) => {
          //console.log(res); //code 已收藏 800
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          } else if (res.data.code == 900) {
            this.likepor.splice(index, 1);
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
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
