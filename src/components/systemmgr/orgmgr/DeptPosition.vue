<template>
  <div v-if="addFormVisible">
    <el-dialog title="部门职位维护" :visible.sync="addFormVisible"  width="600px" :close-on-click-modal="false">
      <el-collapse>
        <template v-for="deptM in formData">
          <el-collapse-item :name="deptM.Id" :key="deptM.Id">
            <template slot="title">
              <span :style="deptM.IsChecked?'font-weight: bold':'font-weight: normal'">{{deptM.Name}}</span>
            </template>
            <template v-for="posM in deptM.PositionList">
              <el-checkbox v-model="posM.IsChecked" :key="posM.Id">{{posM.Name}}</el-checkbox>
            </template>
          </el-collapse-item>
        </template>
      </el-collapse>
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
          formData:[],
          addFormVisible: false
        }
      },
      methods: {
        setAddForm: function (corpId) {
          var _this = this;
          this.addFormVisible = true;
          this.$ajax({
            method: "get",
            url: "/api/CorpDepartPosition?corpId="+corpId
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.formData = resultData.data.data;
              }
            }
          );
        },
        submitForm: function () {
          this.$ajax({
            method: "post",
            url: "/api/CorpDepartPosition",
            data: this.formData
          }).then(res => {
            if (res.data.status == "1") {
              this.$message({message: "提交成功", type: "success"});
              this.$parent.getList();
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

</style>
