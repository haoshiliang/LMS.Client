/**
 * 公共方法
 */
exports.install = function (Vue,options){
  var _this=Vue.prototype;
  var Format=Vue.prototype.$format={};

  /**
   * 格式化是否可用
   * @param row
   * @param column
   * @param cellValue
   */
  Format.rowEnabled=function(row,column,cellValue){
    console.log(cellValue);

    return cellValue == "1"?"启用":"禁用";
  }
  /**
   * 格式化日期
   * @param formatDate
   * @constructor
   */
  Format.rowDate=function(row,column,cellValue){
    return Format.date(new Date(cellValue),"yyyy-MM-dd");
  }
  /**
   * 格式化日期
   * @param formatDate
   * @constructor
   */
  Format.rowDateTime=function(row,column,cellValue){
    return Format.date(new Date(cellValue),"yyyy-MM-dd hh:mm");
  }
  Format.date=function(formatDate,fmt){
    var o = {
      "M+" : formatDate.getMonth()+1,                 //月份
      "d+" : formatDate.getDate(),                    //日
      "h+" : formatDate.getHours(),                   //小时
      "m+" : formatDate.getMinutes(),                 //分
      "s+" : formatDate.getSeconds(),                 //秒
      "q+" : Math.floor((formatDate.getMonth()+3)/3), //季度
      "S"  : formatDate.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (formatDate.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)){
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
      }
    }
    return fmt;
  }
}
