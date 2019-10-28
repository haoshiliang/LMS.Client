import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter);
const router = new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/login',
      component: resolve => require(['@/components/login.vue'], resolve),
      meta: {
        title: '登陆'
      }
    },
    {
      name:"DayLogMgr_DayLogAdd",
      path: '/DayLogMgr/DayLogAdd',
      component: resolve => require(['@/components/worklogmgr/daylogmgr/DayLogAdd.vue'], resolve),
      meta: {
        title: '添加日志'
      }
    },
    {
      path: '/404',
      component: resolve => require(['../components/common/404.vue'], resolve)
    },
    {
      path: '/403',
      component: resolve => require(['../components/common/403.vue'], resolve)
    },
    {
      path: '*',
      redirect: '/404'
    }
  ],
  mode: 'history'
});

//全局路由守卫
router.beforeEach((to, from, next) => {
  //debugger
  console.log('跳转到:', to.fullPath);
  if (to.path == '/tree') {
    next();
  }
  else {
    var token = sessionStorage.getItem('token');
    //如果没登录,都导向登录页
    if (!token) {
      if (to.path !== '/login') {
        next({ path: '/login' })
      }
      else {
        next();
      }
    }
    else {
      next();
    }
  }

})

export default router
