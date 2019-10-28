/**
 *
 * 懒加载动态路由
 */
function lazy(code) {

  //return  resolve => require(["@/components/" + name + ".vue"], resolve)
  return getComponetByPath('/' + code);


}
function getComponetByPath(path) {
  for (var i = 0; i < dynamicRouter.length; i++) {
    var route = dynamicRouter[i];
    if (route.path == path) {
      return route.component;
    }
  }
}
/**
 * 路由定义
 * path跟配置里的资源标示对应,同时跟url地址对应
 */
const dynamicRouter = [
  {
    name: 'index',
    path: '/index',
    component: resolve => require(['@/components/index.vue'], resolve),
    meta: {
      title: '系统首页'
    }
  },
  {
    name: 'Corporation',
    path: '/OrgMgr/Corporation',
    component: resolve => require(['@/components/systemmgr/orgmgr/Corporation.vue'], resolve),
    meta: { title: '机构管理' }
  },
  {
    name: 'Department',
    path: '/OrgMgr/Department',
    component: resolve => require(['@/components/systemmgr/orgmgr/Department.vue'], resolve),
    meta: { title: '部门管理' }
  },
  {
    name: 'Position',
    path: '/OrgMgr/Position',
    component: resolve => require(['@/components/systemmgr/orgmgr/Position.vue'], resolve),
    meta: { title: '职位管理' }
  },
  {
    name: 'SysUser',
    path: '/RoleUserMgr/SysUser',
    component: resolve => require(['@/components/systemmgr/roleusermgr/User.vue'], resolve),
    meta: { title: '用户管理' }
  },
  {
    name: 'SysModule',
    path: '/ModuleMgr/SysModule',
    component: resolve => require(['@/components/systemmgr/modulemgr/Module.vue'], resolve),
    meta: { title: '模块管理' }
  },
  {
    name: 'SysModuleQuery',
    path: '/ModuleMgr/SysModuleQuery',
    component: resolve => require(['@/components/systemmgr/modulemgr/ModuleQuery.vue'], resolve),
    meta: { title: '查询设置' }
  },
  {
    name: 'SysRole',
    path: '/RoleUserMgr/SysRole',
    component: resolve => require(['@/components/systemmgr/roleusermgr/Role.vue'], resolve),
    meta: { title: '角色管理' }
  },
  {
    name:'ckeditor',
    path: '/ckeditor',
    component: resolve => require(['@/components/ckeditor/index.vue'], resolve),
    meta:{title:'文本编辑器'}
  },
  {
    name:'WLDayLogMgr',
    path: '/DayLogMgr/DayLog',
    component: resolve => require(['@/components/worklogmgr/daylogmgr/DayLog.vue'], resolve),
    meta:{title:'日志管理'}
  }
]
export { lazy }

