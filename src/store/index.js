import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 购物袋数量
    shopcartnum: 0,

    //是否加载购物袋数量
    isLoadShopcartnum: false,
  },
  // 方法
  mutations: {
    changeShopcartnum(state, data) {
      state.shopcartnum = data;
    },
    changeIsLoadShopcartnum(state,data) {
      state.isLoadShopcartnum = data;
    },
  },
});
