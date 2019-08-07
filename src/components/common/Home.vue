<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <div class="content_wrapper">
                <v-tags></v-tags>
                <div class="content loading-area"  style="flex: 1;">
                        <transition name="move" mode="out-in">
                        <keep-alive :include="tagsList">
                            <router-view v-if="isRouterAlive"></router-view>
                        </keep-alive>
                    </transition>
                </div>
                <!--<v-footer></v-footer>-->
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .content_wrapper{
       display: flex;
       flex-direction: column;
       height:100%;
    }

</style>

<script>
import vHead from './Header.vue';
import vSidebar from './Sidebar.vue';
import vTags from './Tags.vue';
import vFooter from './Footer.vue';
import bus from './bus';
export default {
  data() {
    return {
      tagsList: [],
      collapse: false,
      isRouterAlive:true
    }
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      var index = this.tagsList.indexOf(this.$route.name);
      if (index > -1) {
        this.tagsList.splice(index, 1);
      }
      this.$nextTick(function () {
        this.isRouterAlive = true;
        this.tagsList.push(this.$route.name);
      })
    }
  },
  components: {
    vHead, vSidebar, vTags, vFooter
  },
  created() {
    bus.$on('collapse', msg => {
      this.collapse = msg;
    })

    // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
    bus.$on('tags', msg => {
      let arr = [];
      for (let i = 0, len = msg.length; i < len; i++) {
        msg[i].name && arr.push(msg[i].name);
      }
      this.tagsList = arr;
    })
  }
}
</script>
