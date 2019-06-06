import {lazy} from './lazyLoading'
/**
 * 拼接动态路由
 */
export default (routerList,routeHideList, sysMenuList) => {
    toRoutes(routerList,routeHideList, sysMenuList)
}
function toRoutes(routerList,routeHideList, sysMenuList) {
  if (sysMenuList) {
    for (var i = 0; i < sysMenuList.length; i++) {
      var sysMenuNode = sysMenuList[i];
      if (!sysMenuNode.ChildList || sysMenuNode.ChildList.length == 0) {
        var code = sysMenuNode.ModulePath;
        var routeNode = {
          name: code,
          path: '/' + code + '/:mid',
          component: lazy(code),
          meta: {title: sysMenuNode.Name},
          children: []
        };
        if (code && code != '') {
          if (sysMenuNode.IsFunction == 0) {
            routerList.push(routeNode);
          }
          else {
            routeHideList.push(routeNode);
          }
        }
      }
      else {
        //子节点存在
        toRoutes(routerList, routeHideList, sysMenuNode.ChildList);
      }
    }
  }
}
