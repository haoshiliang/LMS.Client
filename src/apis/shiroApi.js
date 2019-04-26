import Axios from "axios";
/**
 * 系统认证接口
 */
export default {
    /**
     * 系统登陆
     */
    loginIn: function ({ loginName, password }) {
        var param = {
            loginName: loginName,
            password: password
        };
        return Axios.post('/api/Login',param);
    },
    /**
     * 退出登陆
     */
    loginOut: function (loginName) {
      var param = {
        loginName: loginName
      };
      return Axios.post('/api/Loginout',param);
    },
    /**
     * 记录登陆日志
     */
    loginLog: function ({ip,city}) {
        var param={
            ip:ip,
            city:city
        };
        return Axios.post('/api/loginlog-api/save', param);
    },
    /**
     * 还原数据
     */
    rollBackTables: function () {
        return Axios.post('/api/loginlog-api/rollBackTables');
    },
    setToken:function(token){
        Axios.defaults.headers.common["Authorization"] = token;
    }
}
