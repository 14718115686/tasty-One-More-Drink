//主页main的二级路由
const MainRouets = [
  {
    path: "/home",
    alias: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
  },
  // 菜单
  {
    path: "/menu",
    name: "Menu",
    component: () => import("../views/Menu.vue"),
  },
  // 我的
  {
    path: "/mine",
    name: "Mine",
    component: () => import("../views/Mine.vue"),
  },
  // 购物车
  {
    path: "/shopcart",
    name: "Shopcart",
    component: () => import("../views/Shopcart.vue"),
  },
];

//导出
export const routes = [
  // 主页
  {
    path: "/",
    name: "Main",
    component: () => import("../views/Main.vue"),

    //二级路由
    children: MainRouets,
  },
  // 登录注册
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  // 商品详情的id
  {
    path: "/details/:pid",
    name: "Details",
    component: () => import("../views/Details.vue"),
  },

  // 地址
  {
    path: "/addresslist",
    name: "AddressList",
    component: () => import("../views/AddressList.vue"),
  },
  // 新增地址
  {
    path: "/newaddress",
    name: "NewAddress",
    component: () => import("../views/NewAddress.vue"),
  },

  // :aid?  其中 ? 号表示aid可有可无
  {
    path: "/newaddress/:aid?",
    name: "NewAddress",
    component: () => import("../views/NewAddress.vue"),
  },

  // 结算订单
  {
    path: "/buy",
    name: "Buy",
    component: () => import("../views/Buy.vue"),
  },
  // 我的订单
  {
    path: "/order",
    name: "Order",
    component: () => import("../views/Order.vue"),
  },

  // 个人资料
  {
    path: "/account",
    name: "Account",
    component: () => import("../views/Account.vue"),
  },

  // 我的收藏
  {
    path: "/like",
    name: "Like",
    component: () => import("../views/Like.vue"),
  },

  // 安全中心
  {
    path: "/secure",
    name: "Secure",
    component: () => import("../views/Secure.vue"),
  },

   // 搜索
   {
    path: "/search",
    name: "Search",
    component: () => import("../views/Search.vue"),
  },

   // 忘记密码
   {
    path: "/forget",
    name: "Forget",
    component: () => import("../views/Forget.vue"),
  },
];
