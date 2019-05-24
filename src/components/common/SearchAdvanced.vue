<template>
  <div v-if="showAdvancedQuery">
    <el-dialog title="高级查询" :visible.sync="showAdvancedQuery" width="870px" :close-on-click-modal="false">
      <el-row style="margin: -20px 0 0 0;">
        <el-col :span="24">
          <template v-for="field in this.queryParam.WhereList">
            <div class="searchItem" v-if="field.ControlType=='TextBox'">
              <span>{{field.Title}}：</span>
              <el-input size="small" v-model="field.Value" class="searchInput" @keyup.enter.native="getList"></el-input>
            </div>
          </template>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="this.getList">查询</el-button>
        <el-button type="primary" @click="this.closeWin">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "SearchAdvanced",
      data(){
        return {
          showAdvancedQuery:false
        }
      },
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
          this.queryParam.IsAdvancedQuery = true;
          this.handleGetList();
          this.showAdvancedQuery=false;
        },
        openWin(){
          this.showAdvancedQuery=true;
        },
        closeWin(){
          this.showAdvancedQuery=false;
        }
      }
    }
</script>

<style scoped>

</style>
