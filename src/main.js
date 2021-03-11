import Vue from "vue"; //在node_modules 查找
import App from "./App.vue";
import router from "./router/index"; //可以忽略index文件名
import store from "./store";
//px转rem
import "lib-flexible/flexible";

//引入axios
import axios from "axios";
import VueAxios from "vue-axios";

//vue-cookies
import VueCookies from "vue-cookies";

//注册插件
import {
  NavBar,
  Field,
  Cell,
  CellGroup,
  Button,
  Popup,
  Search,
  Toast,
  Tabbar,
  TabbarItem,
  Swipe,
  SwipeItem,
  Grid,
  GridItem,
  Stepper,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  SwipeCell,
  RadioGroup,
  Radio,
  AddressList,
  AddressEdit,
  SubmitBar,
  Checkbox,
  CheckboxGroup,
  Icon,
  Tab,
  Tabs,
  List,
  Empty,

  Uploader ,
  

 
} from "vant";

// 使用插件
Vue.use(NavBar)
  .use(Field)
  .use(Button)
  .use(Popup)
  .use(Cell)
  .use(CellGroup)
  // (提示)
  .use(Toast)
  .use(Search)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Swipe)
  .use(SwipeItem)

  .use(Grid)
  .use(GridItem)

  .use(Stepper)

  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)

  .use(SwipeCell)

  .use(RadioGroup)
  .use(Radio)
  .use(AddressList)

  .use(AddressEdit)
  .use(SubmitBar)

  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Icon)

  .use(Tab)
  .use(Tabs)

  .use(List)
  .use(Empty)
  .use(Uploader )

  


//请求之前执行,请求拦截器
axios.interceptors.request.use((config) => {
  if (config.method === "post") {
    //序列化post请求参数
    let paramsString = "";
    for (let key in config.data) {
      paramsString += `${key}=${config.data[key]}&`;
    }
    config.data = paramsString.slice(0, -1);
  }
  //返回config
  return config;
});

Vue.use(VueAxios, axios);
Vue.use(VueCookies);
Vue.config.productionTip = false;

//请求路径放在原型属性中
Vue.prototype.baseUrl = "http://www.kangliuyong.com:10002";
Vue.prototype.appkey = "U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA=";


//定义全局过滤器
Vue.filter('formatDate', (data, format) => {
  //data: 需要进行格式化的数据(时间)
  //format: 格式
  // console.log('data ==> ', data);
  // console.log('format ==> ', format);

  let date = new Date(data);
  // console.log('date ==> ', date);

  //获取年份
  let year = date.getFullYear().toString();
  // console.log('year ==> ', year);

  if (/(y+)/.test(format)) {
    // console.log('有年份');
    //获取匹配组的内容
    let yearContent = RegExp.$1;
    // console.log('yearContent ==> ', yearContent);

    format = format.replace(yearContent, year.slice(year.length - yearContent.length));
  }

  //替换月日   时分秒
  let dateObject = {
    M: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    m: date.getMinutes(),
    s: date.getSeconds()
  };

  for (let key in dateObject) {
    //生成动态正则表达式
    let reg = new RegExp(`(${key}+)`);
    // console.log('reg ==> ', reg);
    if (reg.test(format)) {
      //获取匹配组的内容
      let content = RegExp.$1;
      // console.log('content ==> ', content);

      // 替换
      format = format.replace(content, dateObject[key] >= 10 ? dateObject[key] : content.length === 2 ? '0' + dateObject[key] : dateObject[key]);
    }
  }

  return format;
})

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
