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
    name: 'tabpage',
    path: '/tabpage',
    component: resolve => require(['@/components/tabpage/tabpage.vue'], resolve),
    meta: {
      title: '标签选项卡'
    }
  },
  {
    name: 'tablepage',
    path: '/tablepage',
    component: resolve => require(['@/components/tablepage/tablepage.vue'], resolve),
    meta: {
      title: '综合表格页'
    }
  },
  {
    name: 'formpage',
    path: '/formpage',
    component: resolve => require(['@/components/formpage/formpage.vue'], resolve),
    meta: {
      title: '表单页'
    }
  },
  {
    name: 'treepage',
    path: '/treepage',
    component: resolve => require(['@/components/treepage/treepage.vue'], resolve),
    meta: {
      title: '树组件页'
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
    name: 'SysRole',
    path: '/RoleUserMgr/SysRole',
    component: resolve => require(['@/components/systemmgr/roleusermgr/Role.vue'], resolve),
    meta: { title: '角色管理' }
  },
  {
    name: 'SysResource',
    path: '/sysResource',
    component: resolve => require(['@/components/admin/SysResource.vue'], resolve),
    meta: { title: '资源管理' }
  },
  {
    name: 'sysRoleMap',
    path: '/sysRoleMap',
    component: resolve => require(['@/components/admin/SysRoleMap.vue'], resolve),
    meta: { title: '角色权限管理' }
  },
  {
    name: 'msg',
    path: '/msg',
    component: resolve => require(['@/components/message/msg.vue'], resolve),
    meta: { title: '建议留言' }
  },
  {
    name: 'messageboard',
    path: '/messageboard',
    component: resolve => require(['@/components/tablepage/messageboard.vue'], resolve),
    meta: {
      title: '增删改查'
    }
  },
  {
    name: 'messageboard2',
    path: '/messageboard2',
    component: resolve => require(['@/components/tablepage/messageboard2.vue'], resolve),
    meta: {
      title: '增删改查二'
    }
  },
  {
    name: 'transition',
    path: '/transition',
    component: resolve => require(['@/components/flex/transition.vue'], resolve),
    meta: {
      title: '左导航切换效果'
    }
  },
  {
    name:'detail',
    path: '/detail',
    component: resolve => require(['@/components/tablepage/detail.vue'], resolve),
    meta:{title:'详情页'}
  },
  {
    name:'ckeditor',
    path: '/ckeditor',
    component: resolve => require(['@/components/ckeditor/index.vue'], resolve),
    meta:{title:'文本编辑器'}
  }
]
export { lazy }

