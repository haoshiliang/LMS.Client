<template>
  <div>
    <el-col :span="24">
      <template v-for="field in this.queryParam.WhereList">
        <div class="searchItem" v-if="field.ControlType=='TextBox' && field.IsDefaultQuery">
          <span>{{field.Title}}：</span>
          <el-input size="small" v-model="field.Value" class="searchInput" @keyup.enter.native="getList"></el-input>
        </div>
      </template>
      <div class="searchButton">
        <el-button type="primary" size="small" @click="this.getList">查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-more" style="margin: 0" @click="opensAdvanced"></el-button>
      </div>
    </el-col>
    <search-advanced ref="sAdvanced" :query-param="this.queryParam" :handle-get-list="this.handleGetList"/>
  </div>
</template>

<script>
  import searchAdvanced from './SearchAdvanced.vue';
    export default {
      name: "Search",
      components: { searchAdvanced },
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
        },
        opensAdvanced(){
          this.$refs.sAdvanced.openWin();
        }
      },
      created: function () {
      }
    }
</script>

<style scoped>

</style>
