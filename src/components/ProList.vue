<template>
  <div class="proList">
    <div>
      <img class="img-auto" :src="item.smallImg" alt=""  />
    </div>

    <div class="like-name">
      <div class="like-zwname">{{ item.name }}</div>
      <div class="like-ename">
        {{ item.enname }}
      </div>
      <div class="clear">
        <div class="fl like-price">￥{{ item.price }}</div>

        <!-- 阻止冒泡 -->
        <div class="fr like-del" @click.stop="searchList()" v-if="isRemove">
            <van-icon name="delete-o" />
        </div>
        
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProList",
  props: {
    //   商品信息
    item: { 
      type: Object,
      default() {
        return {};
      },
    },
    //   是否显示删除按钮
    isRemove:{ 
        type:Boolean,
        default:false
    },
  },

  methods: {
    
    //移除
    searchList() {
      //发送事件
      this.$emit("searchList");
    },

    
  },
};
</script>

<style lang="less" scoped>
.proList {
  .like-name {
    margin: 10px 0;
    font-size: 13px;
  }

  .like-ename {
    font-size: 12px;
    color: #999999;
    margin: 4px 0 12px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .like-zwname {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .like-price {
    font-size: 14px;
    font-weight: bold;
    color: #00a862;
  }

  .like-del {
    width: 16px;
    height: 16px;
    margin: 1px 0;
    color: #00a862;
  }
}
</style>
