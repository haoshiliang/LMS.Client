<template>
  <div v-if="addFormVisible">
    <el-dialog ref="dailog" title="部门职位维护" :visible.sync="addFormVisible" width="700px" :close-on-click-modal="false">
      <div style="height: 300px; overflow-y: auto; overflow-x: hidden">
        <el-collapse accordion>
          <template v-for="deptM in dpList">
            <el-collapse-item :name="deptM.Id" :key="deptM.Id">
              <template slot="title">
                <span :style="deptM.IsChecked?'font-weight: bold;font-size:15px;':'font-weight: normal;font-size:14px;'">{{deptM.Name}}</span>
              </template>
              <ul class="positionList">
              <template v-for="posM in deptM.PositionList">
                <li>
                  <el-checkbox v-model="posM.IsChecked">{{posM.Name}}</el-checkbox>
                </li>
              </template>
              </ul>
            </el-collapse-item>
          </template>
        </el-collapse>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "DeptPosition",
      data(){
        return {
          dpList:[],
          addFormVisible: false
        }
      },
      methods: {
        setAddForm: function (corpId) {
          this.getList(corpId);
        },
        getList:function(corpId){
          this.$common.setLoadingTarget(".el-dialog");
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/CorpDepartPosition?corpId="+corpId
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.dpList = resultData.data.data;
                _this.addFormVisible = true;
              }
            }
          );
        },
        submitForm: function () {
          this.$common.setLoadingTarget(".el-dialog");
          let param=Object.assign([],this.dpList);
          this.$ajax({
            method: "post",
            url: "/api/CorpDepartPosition",
            data: param
          }).then(res => {
            if (res.data.status == "1") {
              this.$message({message: "提交成功", type: "success"});
              this.closeForm();
            }
            else {
              this.$message({message: res.data.message, type: "error"});
            }
          });
        },
        closeForm: function () {
          this.addFormVisible = false;
        }
      },
      mounted() {
      },
      created() {
      }
    }
</script>

<style scoped>
.positionList{
  margin: 0;
  padding: 0;
}
  .positionList li{
    float: left;
    width: 120px;
    list-style-type: none;
    overflow: hidden;
    margin-right: 3px;
    margin-bottom: 3px;
  }
</style>
