<template>
  <el-col :span="24">
    <template v-for="field in this.queryParam.WhereList">
      <div class="searchItem" v-if="field.ControlType=='TextBox'">
        <span>{{field.Title}}：</span>
        <el-input size="small" v-model="field.Value" class="searchInput" @keyup.enter.native="getList"></el-input>
      </div>
    </template>
    <div class="searchButton">
      <el-button type="primary" size="small" @click="this.getList">查询</el-button>
      <el-button type="primary" size="small" icon="el-icon-more" style="margin: 0"></el-button>
    </div>
  </el-col>
</template>

<script>
    export default {
      name: "Search",
      props: {
        queryParam: {
          type: Object,
          default: () => {
          },
          required: true
        },
        handleGetList: {}
      },
      methods: {
        getList() {
          this.queryParam.IsAdvancedQuery = false;
          this.handleGetList();
        }
      },
      created: function () {
      }
    }
</script>

<style scoped>

</style>
