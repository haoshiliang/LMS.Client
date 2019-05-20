<template>
  <el-col :span="24">
    <template v-for="field in this.whereList">
      <div class="searchItem" v-if="field.ControlType=='TextBox'">
        <span>{{field.Title}}：</span>
        <el-input size="small" placeholder="请输入内容" v-model="field.Value" class="searchInput"></el-input>
      </div>
    </template>
    <div class="searchButton">
      <el-button type="primary" size="small" @click="this.getList">查询</el-button>
    </div>
  </el-col>
</template>

<script>
    export default {
      name: "Search",
      props: {
        whereList: {
          type: Array,
          default: () => []
        },
        handleGetList:{}
      },
      methods:{
        getList() {
          this.handleGetList();
        }
      },
      created:function () {
      }
    }
</script>

<style scoped>

</style>
