<template>
  <div v-if="addFormVisible">
    <el-dialog title="模块功能维护" :visible.sync="addFormVisible"  width="600px" :close-on-click-modal="false">
      <el-form label-position="right" :rules="rules" :model="ruleForm" ref="ruleForm" size="small" inline-message inline>
        <el-table :data="ruleForm.functionList" style="width: 100%"
                   size="medium" border  highlight-current-row
                  height="300"
                  @current-change="handleCurrentChange">
          <el-table-column prop="Code" label="功能编号">
            <template slot-scope="scope">
              <el-form-item :prop="'functionList.' + scope.$index + '.Code'" :rules='rules.Code'>
                <el-input auto-complete="off" placeholder="功能编号" v-model="scope.row.Code"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="Name" label="功能名称">
          <template slot-scope="scope">
            <el-form-item :prop="'functionList.' + scope.$index + '.Name'" :rules='rules.Name'>
              <el-input auto-complete="off" placeholder="功能名称" v-model="scope.row.Name"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
          <el-table-column prop="IsEnabled" label="状态" width="100">
            <template slot-scope="scope">
                <el-switch v-model="scope.row.IsEnabled"></el-switch>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addRow">添加</el-button>
        <el-button type="danger" @click="delRow">删除</el-button>
        <el-button type="warning" @click="submitForm">提交</el-button>
        <el-button @click="addFormVisible=false">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "ModuleFunctionAdd",
      data() {
        return {
          mId:'',
          ruleForm:{functionList: []},
          addFormVisible: false,
          selectedRow:null,
          rules: {
            Code: [{ required: true, message: '功能编号不能为空', trigger: 'blur' }],
            Name: [{ required: true, message: '功能名称不能为空', trigger: 'blur' }],
          }
        }
      },
      methods: {
        submitForm: function () {
          this.$refs.ruleForm.validate(valid => {
            if (valid) {
              let param = Object.assign([], this.ruleForm.functionList);
              this.$ajax({
                method: "post",
                url: "/api/Function",
                data: param
              }).then(res => {
                if (res.data.status == "1") {
                  this.$message({message: "提交成功", type: "success"});
                  this.addFormVisible = false;
                }
              });
            }
          });
        },
        setAddForm: function (mId,editFormData) {
          this.mId = mId;
          this.ruleForm.functionList = editFormData;
          this.addFormVisible = true;
        },
        addRow:function () {
          this.ruleForm.functionList.push({Id:'',Name:'',ParentId:this.mId,IsEnabled:true});
        },
        delRow:function () {
          if (this.selectedRow != null) {
            this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
              .then(() => {
                let fList=this.ruleForm.functionList;
                for (var i=0,len=fList.length;i<len;i++){
                  if (fList[i].Id == this.selectedRow.Id){
                    this.ruleForm.functionList.splice(i,1);
                    break;
                  }
                }
              }).catch(() => {
            });
          }
          else {
            this.$message.info("请选择要删除的行!");
          }
        },
        handleCurrentChange(val) {
          this.selectedRow = val;
        }
      }
    }
</script>

<style scoped>
.elFormItem{
  height: 20px;
}
.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
  margin-bottom: 0;
}
</style>
