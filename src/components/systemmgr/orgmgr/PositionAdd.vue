<template>
  <div v-if="addFormVisible">
    <el-dialog  v-dialogDrag :title="title" :visible.sync="addFormVisible"  width="600px" :close-on-click-modal="false">
      <el-form :model="formData" ref="formData" label-width="80px" :rules="rules">
        <el-form-item label="职位编码"  prop="PositionCode">
          <el-input auto-complete="off" placeholder="职位编码" v-model="formData.PositionCode"></el-input>
        </el-form-item>
        <el-form-item label="职位名称"  prop="PositionName">
          <el-input auto-complete="off" placeholder="职位名称" v-model="formData.PositionName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "PositionAdd",
      data() {
        return {
          rules: {
            PositionCode: [{required: true, message: '请输入职位编码', trigger: 'blur'}],
            PositionName: [{required: true, message: '请输入职位名称', trigger: 'blur'}]
          },
          formData: {
            Id:'',
            PositionCode: '',
            PositionName: ''
          },
          defalutData:{},
          title: "",
          addFormVisible: false,
        }
      },
      methods: {
        resetForm: function () {
          if (this.$refs["formData"])
            this.$refs["formData"].resetFields();
        },
        setAddForm: function (id, editFormData) {
          this.addFormVisible = true;
          this.resetForm();
          if (id != "") {
            this.title = "修改职位信息";
            this.formData = editFormData;
          } else {
            this.formData = Object.assign({}, this.defalutData);
            this.title = "添加职位信息";
          }
        },
        submitForm: function () {
          this.$refs.formData.validate(valid => {
            if (valid) {
              let param = Object.assign({}, this.formData);
              this.$common.setLoadingTarget(".el-dialog");
              this.$ajax({
                method: "post",
                url: "/api/Position",
                data: param
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
            }
          });
        },
        closeForm: function () {
          this.addFormVisible = false;
        }
      },
      mounted() {
        this.defalutData = Object.assign({}, this.formData);
      },
      created() {
      }
    }
</script>

<style scoped>

</style>
