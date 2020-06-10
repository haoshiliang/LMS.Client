<template>
  <div v-if="addFormVisible">
    <el-dialog v-dialogDrag :title="title" :visible.sync="addFormVisible"  width="700px" :close-on-click-modal="false">
      <el-form :model="moduleForm" :inline="true" ref="moduleForm" label-width="100px" :rules="moduleRules">
        <el-form-item label="模块父级" prop="ParentId">
          <select-tree v-model="moduleForm.ParentId" :showText="moduleForm.ParentName" :options="moduleList" :props="defaultProps" width="207" />
        </el-form-item>
        <el-form-item label="模块编码"  prop="Code">
          <el-input auto-complete="off" placeholder="模块编码" v-model="moduleForm.Code"></el-input>
        </el-form-item>
        <el-form-item label="模块标题"  prop="Name">
          <el-input auto-complete="off" placeholder="模块名称" v-model="moduleForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="模块图标"  prop="Icon">
          <el-input auto-complete="off" placeholder="模块图标" v-model="moduleForm.Icon"></el-input>
        </el-form-item>
        <el-form-item label="模块标识"  prop="ModuleName">
          <el-input auto-complete="off" placeholder="模块标识" v-model="moduleForm.ModuleName"></el-input>
        </el-form-item>
        <el-form-item label="模块路径"  prop="ModulePath">
          <el-input auto-complete="off" placeholder="模块路径" v-model="moduleForm.ModulePath"></el-input>
        </el-form-item>
        <el-form-item label="启用"  prop="IsEnabled">
          <el-switch v-model="moduleForm.IsEnabled"></el-switch>
        </el-form-item>
        <el-form-item label="允许设置查询"  prop="IsAllowQuery">
          <el-switch v-model="moduleForm.IsAllowQuery"></el-switch>
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
  import SelectTree from '@/components/common/SelectTree.vue';
    export default {
      name: "ModuleAdd",
      components: {SelectTree},
      data() {
        return {
          // 数据默认字段
          defaultProps: {
            parent: 'ParentId',   // 父级唯一标识
            value: 'Id',          // 唯一标识
            label: 'Name',       // 标签显示
            children: 'ChildList'
          },
          moduleRules: {
            Code: [{required: true, message: '请输入模块编码', trigger: 'blur'}],
            Name: [{required: true, message: '请输入模块名称', trigger: 'blur'}]
          },
          moduleList: [],
          moduleForm: {
            Id:'',
            ParentId: '',
            ParentName: '',
            Code: '',
            Name: '',
            Icon:'',
            ModuleName:'',
            ModulePath:'',
            IsEnabled:true,
            IsAllowQuery:true
          },
          title: "",
          addFormVisible: false,
          defalutData:{}
        }
      },
      methods: {
        async getModuleList() {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          var res = await this.$ajax({
            method: "get",
            url: "/api/Module/TreeList?id="+this.moduleForm.Id
          });
          if (res.data.status == '1') {
            _this.moduleList = res.data.data;
            this.addFormVisible = true;
          }
        },
        resetForm: function () {
          if (this.$refs["moduleForm"])
            this.$refs["moduleForm"].resetFields();
        },
        setAddForm: function (id, parentId, parentName,editFormData) {
          this.resetForm();
          if (id != "") {
            this.title = "修改模块信息";
            this.moduleForm = editFormData;
          } else {
            this.title = "添加模块信息";
            this.moduleForm = Object.assign({}, this.defalutData);
          }
          this.getModuleList();
          this.moduleForm.ParentId = parentId;
          this.moduleForm.ParentName = parentName;
        },
        submitForm: function () {
          this.$refs.moduleForm.validate(valid => {
            if (valid) {
              let param = Object.assign({}, this.moduleForm);
              if (param.ChildList){
                delete param.ChildList;
              }
              if(param.parent){
                delete param.parent;
              }
              this.$common.setLoadingTarget(".el-dialog");
              this.$ajax({
                method: "post",
                url: "/api/Module",
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
        this.defalutData = Object.assign({}, this.moduleForm);
      },
      created() {
      }
    }
</script>

<style scoped>

</style>
