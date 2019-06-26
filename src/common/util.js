/**
 * 公共方法
 */
exports.install = function (Vue,options){
  var _this=Vue.prototype;
  var Common=Vue.prototype.$common={};
  var loading=null;
  var loadingCnt = 0;
  /**
   * 在新页面打开
   * @param {*} $this
   * @param {*} routeName
   * @param {*} param 参数对象，对象格式
   */
  Common.OpenNewPage=function($this,routePath,param){
    let routeData=$this.$router.resolve({
      path:routePath,
      query:param
    });
    window.open(routeData.href,'_blank');
  }
  /**
   * 写入sessionStorage
   */
  Common.setSessionStorage=function(key,objData){
    if(typeof objData=='string'){
      sessionStorage.setItem(key,objData);
    }
    else{
      sessionStorage.setItem(key,JSON.stringify(objData));
    }

  }
  /**
   *  加载Loading
   */
  Common.openLoading=function(loadText){
    loadText=(loadText=="" || loadText==null)?"正在加载，请稍候...":loadText;
    loadingCnt+=1;
    loading = _this.$loading({
      lock: true,
      text: loadText,
      spinner: 'el-icon-loading',
      background: "rgba(127, 127, 127, 0.7)"
    });
  },
    /**
     * 关闭Loading
     */
    Common.closeLoading=function(){
      loadingCnt-=1;
      if (loading && loadingCnt<=0){
        loadingCnt = 0;
        loading.close();
      }
    }
  /**
   * 获取菜单功能
   */
  Common.getFList=function(mId){
    var menuList=Common.getSessionStorage("menuList",true);
    var currentMenu = [];
    getMenuList(menuList,mId,currentMenu);
    console.log(currentMenu);
    if (currentMenu.length==0) {
      return {FunctionList: {}};
    }
    return currentMenu[0].FunctionList;
  }
  /**
   * 获取菜单功能
   * @param menuList
   */
  function getMenuList(menuList,mId,currentMenu) {
    for (var i=0,len=menuList.length;i<len;i++) {
      if (menuList[i].Id.toUpperCase()==mId.toUpperCase()){
        currentMenu.push(menuList[i]);
      }
      else if (menuList[i].ChildList && menuList[i].ChildList.length>0){
        getMenuList(menuList[i].ChildList,mId,currentMenu);
      }
    }
  }
  /**
   * 读取sessionStorage
   */
  Common.getSessionStorage=function(key,isObj){
    var data= sessionStorage.getItem(key);
    if(isObj){
      return JSON.parse(data);
    }
    return data;
  },
    /**
     * 移除sessionStorage
     */
    Common.removeSessionStorage=function(key){
      sessionStorage.removeItem(key);
    },
    Common.timestampToTime =function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
    Common.isSuccess =function(data,callback) {
      if (data && data.data) {
        var json = data.data;
        if (json.status == 'SUCCESS') {
          _this.$message({message: '执行成功',type: "success"});
          callback(json);
        }
        else if (json.message) {
          _this.$message({message: json.message,type: "error"});
        }
      }
      else{
        _this.$message({message: '执行异常，请重试',type: "error"});
      }
    }
}
