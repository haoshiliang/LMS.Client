<template>
  <div class="sidebar">
    <div :class="titleStyle">{{title}}</div><!--deepblue:506aa9;green:009676-->
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#506aa9"
             text-color="#eee" active-text-color="#ccca37" unique-opened router :defaultOpeneds='defaultOpeneds'>
      <template v-for="(item,i) in menuList">
        <template v-if="item.subs&&item.subs.length">
          <el-submenu :index="(i+1).toString()" :key="i">
            <template slot="title">
              <i :class="item.icon+' sidebar-icon-color'"></i><span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="(subItem,j) in item.subs">
              <template v-if="subItem.subs&&subItem.subs.length">
                <el-submenu :index="(i+1)+'-'+(j+1)" :key="j">
                  <template slot="title">
                    <i :class="subItem.icon+' sidebar-icon-color'"></i><span slot="title">{{ subItem.title }}</span>
                  </template>
                  <el-menu-item  v-for="(leafItem,i) in subItem.subs" :key="i" :index="'/'+leafItem.index+'/'+leafItem.id">
                    <span class="sidebar-el-subitem">{{ leafItem.title }}</span>
                  </el-menu-item>
                </el-submenu>
              </template>
              <template v-else>
                <el-menu-item :index="subItem.index+'/'+subItem.id" :key="j">
                  <span class="sidebar-el-subitem">{{ subItem.title }}</span>
                </el-menu-item>
              </template>
            </template>
          </el-submenu>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
  import bus from './bus';
  import { mapState } from 'vuex'
  export default {
    data() {
      return {
        collapse: false,
        items: [],
        defaultOpeneds:['1']
      }
    },
    computed:mapState({
      menuList:state=>state.menu.menuList,
      onRoutes(){
        return this.$route.path;
      },
      titleStyle:function () {
        return this.collapse?"sidebar-title-collapse":"sidebar-title";
      },
      title:function () {
        return (this.collapse?"":"至诚无息，博厚悠远");
      }
    }),
    created(){
      // 通过 Event Bus 进行组件间通信，来折叠侧边栏
      bus.$on('collapse', msg => {
        this.collapse = msg;
      })
    }
  }
</script>

<style scoped>
  .sidebar{
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom:0;
    overflow-y: scroll;
  }
  .sidebar::-webkit-scrollbar{
    width: 0;
  }
  .sidebar-el-menu:not(.el-menu--collapse){
    width: 200px;
  }
  .sidebar > ul {
    height:100%;
  }
  .sidebar-icon-color{
    color: #fff;
  }
  .el-submenu .el-menu-item{
    height: 40px;
    line-height: 40px;
  }
  .el-menu--popup{
    padding: 0;
  }
</style>
