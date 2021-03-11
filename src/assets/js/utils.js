//导入提示组件(局部的要{..})
import { Toast } from 'vant';

class Utils {
  //验证表单
  validForm(o) {
    //验证表单的数据, object
    for (let key in o) {
      if (!o[key].reg.test(o[key].value)) {
        //提示(插件)
        Toast({
          message: o[key].errorMsg,
          duration: 3000,  //报错提示的时间
          forbidClick: true, //提示期间无法点击页面
        });
        return false;
      }
    }
    //表单验证通过
    return true;
  }
}

//导出 (对外开放)
export const utils = new Utils();
