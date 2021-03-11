<template>
  <div class="search">
    <div>
      <van-nav-bar left-text="返回" left-arrow fixed @click-left="back">
        <template #right>
          <div class="home-sea">
            <van-search
              placeholder="输入商品名称"
              ref="search"
              @search="search"
              v-model="name"
            />
          </div>
        </template>
      </van-nav-bar>
    </div>

    <Background>
      <div class="clear" v-if="products.length > 0">
        <div
          class="fl like-list"
          v-for="(item, index) in products"
          :key="index"
          @click="pordetails(item.pid)"
        >
          <!-- 接收事件 ProList-->
          <ProList
            :item="item"
            @searchList="remomeLike(item.pid, index)"
            
          >
          </ProList>
        </div>
      </div>

      <div v-else>
        <van-empty />
      </div>
    </Background>
  </div>
</template>

<script>
import ProList from "../components/ProList.vue";
import Background from "../components/Background.vue";

export default {
  name: "Search",
  components: {
    Background,
    ProList,
  },

  data() {
    return {
      //搜索商品关键字
      name: "",

      // 搜索商品
      products: [],
    };
  },

  created() {
    this.$nextTick(() => {
      //
      //   console.log(this.$refs);

      //获取搜索框(原生)
      let seaInp = this.$refs.search.querySelector('[type="search"]');

      //   console.log(seaInp);
      // 获取焦点
      seaInp.focus();
    });
  },

  methods: {
    //   返回上一级
    back() {
      this.$router.go(-1);
    },
    //查看商品详情
    pordetails(pid) {
      // console.log(pid);
      this.$router.push({ name: "Details", params: { pid } });
    },

    search() {
      // 加载插件
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0,
      });

      // 请求数据
      this.axios({
        method: "get",
        url: this.baseUrl + "/search",
        params: {
          appkey: this.appkey,
          name: this.name,
        },
      })
        .then((res) => {
          //console.log(res);
          this.$toast.clear();

          //判断是否存在
          if (res.data.code === "Q001") {
            this.products = res.data.result;
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

<style lang="less" scoped>
.search {
  padding-top: 46px;
  /deep/ .van-nav-bar__text,
  /deep/ .van-nav-bar__arrow {
    color: #00a862;
  }

  /deep/ .home-sea .van-search {
    padding: 0;
    border-radius: 17px;
    overflow: hidden;
  }

  /deep/ .home-sea .van-icon {
    color: #00a862;
  }

  .like-list {
    width: calc(~"100% / 3 - 10px + 10px / 3");
    // height: 100px;
    // background: pink;
    margin-right: 10px;
    margin-bottom: 10px;
    border-bottom: 1px solid #00a862;
    // 每三个
    &:nth-child(3n) {
      margin-right: 0;
    }
  }
}
</style>
