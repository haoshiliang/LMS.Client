<template>
  <div v-if="addFormVisible">
    <el-dialog :title="title" :visible.sync="addFormVisible"  width="900px" :close-on-click-modal="false">
      <el-form :model="moduleQueryForm" :inline="true" ref="moduleQueryForm" label-width="100px" size="mini" :rules="moduleQueryRules" :show-message="true" :hide-required-asterisk="false">
        <el-form-item label="搜索项名称" prop="Title">
          <el-input auto-complete="off" placeholder="搜索项名称" v-model="moduleQueryForm.Title" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="参数名称"  prop="ParamName">
          <el-input auto-complete="off" placeholder="参数名称" v-model="moduleQueryForm.ParamName" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="查询字段名"  prop="Field">
          <el-input auto-complete="off" placeholder="登录名称" v-model="moduleQueryForm.Field" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="操作类型"  prop="Operator">
          <el-select v-model="moduleQueryForm.Operator" placeholder="请选择操作类型" style="width: 150px;">
            <el-option label="like" value="like"></el-option>
            <el-option label="in" value="in"></el-option>
            <el-option label="exists" value="exists"></el-option>
            <el-option label="=" value="="></el-option>
            <el-option label="<>" value="<>"></el-option>
            <el-option label=">" value=">"></el-option>
            <el-option label=">=" value=">="></el-option>
            <el-option label="<" value="<"></el-option>
            <el-option label="<=" value="<="></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="控件类型"  prop="ControlType">
          <el-select v-model="moduleQueryForm.ControlType" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in controlTypeList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="数据类型"  prop="DataType">
          <el-select v-model="moduleQueryForm.DataType" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in dataTypeList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="目标参数名"  prop="TargetName">
          <el-select v-model="moduleQueryForm.TargetName" placeholder="需要级联更新的目标参数名" style="width: 150px;"  :disabled="targetEnabled">
            <el-option
              v-for="item in queryList"
              :key="item.Id"
              :label="item.Title"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="源参数名1"  prop="RelationId_1">
          <el-select v-model="moduleQueryForm.RelationId_1" placeholder="需要级联更新的源参数名1" style="width: 150px;" :disabled="dropEnabled">
            <el-option
              v-for="item in queryList"
              :key="item.Id"
              :label="item.Title"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="源参数名2"  prop="RelationId_2">
          <el-select v-model="moduleQueryForm.RelationId_2" placeholder="需要级联更新的源参数名2" style="width: 150px;" :disabled="dropEnabled">
            <el-option
              v-for="item in queryList"
              :key="item.Id"
              :label="item.Title"
              :value="item.Id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="默认查询值"  prop="DefaultValue">
          <el-input v-if="moduleQueryForm.DataType==1" auto-complete="off" placeholder="默认查询值" v-model="moduleQueryForm.DefaultValue" style="width: 150px;"></el-input>
          <el-select v-else-if="moduleQueryForm.DataType==2" v-model="moduleQueryForm.DefaultValue" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in defaultDateList"
              :key="item.Id"
              :label="item.Name"
              :value="item.Id">
            </el-option>
          </el-select>
          <el-input-number v-else-if="moduleQueryForm.DataType==3" v-model="moduleQueryForm.DefaultValue" :precision="2" :step="0.1" style="width: 150px;"></el-input-number>
          <el-checkbox v-else-if="moduleQueryForm.DataType==4" v-model="moduleQueryForm.DefaultValue" style="width: 150px;">是否选中</el-checkbox>
          <el-input v-else auto-complete="off" placeholder="默认查询值" v-model="moduleQueryForm.DefaultValue" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="排序"  prop="DisplayOrder">
            <el-input-number v-model="moduleQueryForm.DisplayOrder" :precision="0" :step="1" style="width: 150px;"></el-input-number>
        </el-form-item>
        <el-form-item label="默认查询"  prop="IsDefaultQuery">
          <el-switch v-model="moduleQueryForm.IsDefaultQuery"></el-switch>
        </el-form-item>
        <el-form-item label="下拉数据源"  prop="DropdownDataSource">
          <el-select v-model="moduleQueryForm.DropdownDataSource" placeholder="请选择下拉数据源" style="width: 150px;" :disabled="dropEnabled">
            <el-option
              v-for="item in dropdownDataSource"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" "></el-form-item>
        <el-form-item label=" "></el-form-item>
        <el-form-item label=" "></el-form-item>
        <el-form-item label="下拉选项值"  prop="DownListValue">
          <el-input type="textarea" :rows="5" placeholder="自定义数据
选项1ID|选项1名称
选项2ID|选项2名称
数据库数据
SELECT ID,NAME FROM DUAL
" v-model="moduleQueryForm.DownListValue" style="width: 300px;" :disabled="dropEnabled"></el-input>
        </el-form-item>
        <el-form-item label="Exists条件"  prop="Exists">
          <el-input type="textarea" :rows="5" placeholder="Exists条件" v-model="moduleQueryForm.Exists" style="width: 300px;" :disabled="existsEnabled"></el-input>
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
      name: "ModuleQueryAdd",
      data() {
        return {
          moduleQueryRules: {
            Title: [{required: true, message: '请输入搜索项名称', trigger: 'blur'}],
            Field: [{required: true, message: '请输入查询字段名', trigger: 'blur'}],
            ParamName: [{required: true, message: '请输入参数名称', trigger: 'blur'}],
            Operator: [{required: true, message: '请选择操作类型', trigger: 'blur'}],
            DataType: [{required: true, message: '请选择数据类型', trigger: 'blur'}],
            ControlType: [{required: true, message: '请选择控件类型', trigger: 'blur'}]
          },
          moduleQueryForm: {
            Id: '',
            ModuleId: '',
            Title: '',
            Field: '',
            ParamName: '',
            Operator: '',
            DefaultValue: '',
            DownListValue: '',
            Exists: '',
            TargetName: '',
            DataType: '',
            ControlType: '',
            DropdownDataSource: 0,
            IsDefaultQuery: true,
            RelationId_1: '',
            RelationId_2: '',
            RelationId_3: '',
            DisplayOrder: 0
          },
          title: "",
          addFormVisible: false,
          defalutData: {},
          defaultDateList: [],
          controlTypeList: [],
          dataTypeList: [],
          queryList:[],
          dropdownDataSource: [{label: '自定义', value: 0}, {label: '数据库', value: 1}]
        }
      },
      methods: {
        getControlType: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/Common/ControlType",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.controlTypeList = resultData.data.data;
              }
            }
          );
        },
        getDataType: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/Common/DataType",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.dataTypeList = resultData.data.data;
              }
            }
          );
        },
        getDefaultList: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/Common/DateDefalutValueType",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.defaultDateList = resultData.data.data;
              }
            }
          );
        },
        getRelationList: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/ModuleQuery/GetByModuleId?moduleId="+this.moduleQueryForm.ModuleId+"&id="+this.moduleQueryForm.Id,
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.queryList = resultData.data.data;
              }
            }
          );
        },
        resetForm: function () {
          if (this.$refs["moduleQueryForm"])
            this.$refs["moduleQueryForm"].resetFields();
        },
        setAddForm: function (id, moduleId,editFormData) {
          this.addFormVisible = true;
          if (id != "") {
            this.title = "修改查询设置信息";
            this.moduleQueryForm = editFormData;
          } else {
            this.title = "添加查询设置信息";
            this.defalutData.ModuleId = moduleId;
            this.moduleQueryForm = Object.assign({}, this.defalutData);
          }
          setTimeout(() => {
            this.getControlType();
            this.getDataType();
            this.getDefaultList();
            this.getRelationList();
          }, 200);
        },
        submitForm: function () {
          this.$refs.moduleQueryForm.validate(valid => {
            if (valid) {
              let param = Object.assign({}, this.moduleQueryForm);
              this.$common.setLoadingTarget(".el-dialog");
              this.$ajax({
                method: "post",
                url: "/api/ModuleQuery",
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
      computed: {
        existsEnabled:function () {
          if (this.moduleQueryForm.Operator=="exists"){
            return false;
          }else{
            this.moduleQueryForm.Exists='';
            return true;
          }
        },
        dropEnabled:function () {
          if (this.moduleQueryForm.ControlType=="3" || this.moduleQueryForm.ControlType=="4"){
            return false;
          }else{
            this.moduleQueryForm.RelationId_1='';
            this.moduleQueryForm.RelationId_2='';
            this.moduleQueryForm.DownListValue='';
            this.moduleQueryForm.DropdownDataSource = 0;
            return true;
          }
        },
        targetEnabled:function () {
          if (this.moduleQueryForm.ControlType=="3" || this.moduleQueryForm.ControlType=="4" || this.moduleQueryForm.ControlType=="5"){
            return false;
          }else{
            this.moduleQueryForm.TargetName='';
            return true;
          }
        }
      },
      mounted() {
        this.defalutData = Object.assign({}, this.moduleQueryForm);
      },
      created() {
      }
    }
</script>

<style scoped>

</style>
