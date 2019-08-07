<template>
    <div class="tags" v-if="showTags">
        <ul>
            <li class="tags-li" v-for="(item,index) in tagsList" :class="{'active': isActive(item.path)}" :key="index">
                <router-link :to="item.path" class="tags-li-title">
                    {{item.title}}
                </router-link>
                <span class="tags-li-icon" @click="closeTags(index)" v-if="item.path!='/index' && item.path!='/'"><i class="el-icon-close"></i></span>
            </li>
        </ul>
        <div class="tags-reload-box">
          <el-button icon="el-icon-refresh" size="medium" type="primary" @click="this.$parent.reload"></el-button>
        </div>
        <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="medium" type="primary">
                    标签选项<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu size="medium" slot="dropdown">
                    <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>

    </div>
</template>

<script>
    import bus from './bus';
    export default {
        data() {
            return {
                tagsList: []
            }
        },
        methods: {
            isActive(path) {
                return path === this.$route.fullPath;
            },
            // 关闭单个标签
            closeTags(index) {
                const delItem = this.tagsList.splice(index, 1)[0];
                const item = this.tagsList[index] ? this.tagsList[index] : this.tagsList[index - 1];
                if (item) {
                    delItem.path === this.$route.fullPath && this.$router.push(item.path);
                }else{
                    this.$router.push('/');
                }
            },
            // 关闭全部标签
            closeAll(){
              const curItem = this.tagsList.filter(item => {
                return (item.path === '/index' || item.path === '/');
              })
              this.tagsList = curItem;
              this.$router.push('/');
            },
            // 关闭其他标签
            closeOther(){
                const curItem = this.tagsList.filter(item => {
                    return (item.path === this.$route.fullPath || item.path === '/index' || item.path === '/');
                })
                this.tagsList = curItem;
            },
            // 设置标签
            setTags(route){
                const isExist = this.tagsList.some(item => {
                    return item.path === route.fullPath;
                })
                !isExist && this.tagsList.push({
                    title: route.meta.title,
                    path: route.fullPath,
                    // name: route.matched[1].components.default.name
                    name: route.name
                })
                bus.$emit('tags', this.tagsList);
            },
            handleTags(command){
                command === 'other' ? this.closeOther() : this.closeAll();
            }
        },
        computed: {
            showTags() {
                return this.tagsList.length > 0;
            }
        },
        watch:{
            $route(newValue, oldValue){
                this.setTags(newValue);
            }
        },
        created(){
            this.setTags(this.$route);
        }
    }

</script>


<style lang="scss">
    $tag_height:38px;//tab高度变量
    .tags {
        position: relative;
        height: $tag_height;
        overflow: hidden;
        background: #fff;
        padding-right: 170px;
        flex: 0 0 auto;
    }

    .tags ul {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
    }

    .tags-li {
      float: left;
      margin: 3px 5px 2px 3px;
      border-radius: 3px;
      font-size: 14px;
      overflow: hidden;
      cursor: pointer;
      height: $tag_height - 8px;
      line-height: $tag_height - 8px;
      background: #fff;
      padding: 0 5px 0 12px;
      vertical-align: middle;
      -webkit-transition: all .3s ease-in;
      -moz-transition: all .3s ease-in;
      transition: all .3s ease-in;
    }

    .tags-li-title {
        float: left;
        max-width: 80px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
    }

    .tags-close-box {
        position: absolute;
        right: 0;
        top: 0;
        box-sizing: border-box;
        padding-top: 1px;
        text-align: center;
        width: 110px;
        height: $tag_height;
        background: #fff;
        box-shadow: -3px 0 15px 3px rgba(0, 0, 0, .1);
        z-index: 10;
    }
  .tags-reload-box{
    position: absolute;
    right: 111px;
    top: 0;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    height: $tag_height;
    background: #fff;
    z-index: 10;

  }

</style>
