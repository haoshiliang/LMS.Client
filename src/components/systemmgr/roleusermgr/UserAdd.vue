<template>
  <div v-if="addFormVisible" id="loadingDiv">
    <el-dialog :title="title" :visible.sync="addFormVisible"  width="700px" :close-on-click-modal="false">
      <el-form :model="userForm" :inline="true" ref="userForm" label-width="90px" :rules="userRules">
        <el-form-item label="用户编码" prop="Code">
          <el-input auto-complete="off" placeholder="用户编码" v-model="userForm.Code"></el-input>
        </el-form-item>
        <el-form-item label="用户名称"  prop="Name">
          <el-input auto-complete="off" placeholder="用户名称" v-model="userForm.Name"></el-input>
        </el-form-item>
        <el-form-item label="登录名称"  prop="LoginName">
          <el-input auto-complete="off" placeholder="登录名称" v-model="userForm.LoginName"></el-input>
        </el-form-item>
        <el-form-item label="登录密码"  prop="Password">
          <el-input type="password" placeholder="登录密码" v-model="userForm.Password"></el-input>
        </el-form-item>
        <el-form-item label="所属职位"  prop="getPosition">
             <el-input @click.native="selectPosition" auto-complete="off" placeholder="所属职位" style="width:516px;" readonly v-model="getPosition" suffix-icon="el-icon-search"></el-input>
        </el-form-item>
        <el-form-item label="地址"  prop="Address">
          <el-input auto-complete="off" placeholder="地址" v-model="userForm.Address" style="width:516px;"></el-input>
        </el-form-item>
        <el-form-item label="电话"  prop="Tel">
          <el-input auto-complete="off" placeholder="电话" v-model="userForm.Tel"></el-input>
        </el-form-item>
        <el-form-item label="启用"  prop="IsEnabled">
          <el-switch v-model="userForm.IsEnable"></el-switch>
        </el-form-item>
        <el-form-item label="超级管理员"  prop="IsSuperAdmin">
          <el-switch v-model="userForm.IsSuperAdmin"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </el-dialog>
    <select-positon ref="selPosition" :select="callbackPosition"/>
  </div>
</template>

<script>
  import selectPositon from "@/components/common/SelectPosition"
    export default {
      name: "UserAdd",
      components:{selectPositon},
      data() {
        return {
          userRules: {
            Code: [{required: true, message: '请输入用户编码', trigger: 'blur'}],
            Name: [{required: true, message: '请输入用户名称', trigger: 'blur'}],
            LoginName: [{required: true, message: '请输入登录名称', trigger: 'blur'}],
            Password: [{required: true, message: '请输入登录密码', trigger: 'blur'}],
            Position: [{required: true, message: '请选择所属职位', trigger: 'blur'}]
          },
          userList: [],
          userForm: {
            Id:'',
            Code: '',
            Name: '',
            LoginName: '',
            Password: '',
            IsSuperAdmin:false,
            Tel:'',
            Address:'',
            CorpId:'',
            CorporationModel:{CorpName:''},
            DeptId:'',
            DepartmentModel:{DepartName:''},
            PositionId:'',
            PositionModel:{PositionName:''},
            IsEnable:true
          },
          title: "",
          addFormVisible: false,
          defalutData:{}
        }
      },
      methods: {
        resetForm: function () {
          if (this.$refs["userForm"])
            this.$refs["userForm"].resetFields();
        },
        setAddForm: function (id,editFormData) {
          if (id != "") {
            this.title = "修改用户信息";
            this.userForm = editFormData;
          } else {
            this.title = "添加用户信息";
            this.userForm = Object.assign({}, this.defalutData);
            this.userForm.CorporationModel.CorpName = '';
            this.userForm.DepartmentModel.DepartName = '';
            this.userForm.PositionModel.PositionName = '';
          }
          this.addFormVisible = true;
        },
        submitForm: function () {
          this.$refs.userForm.validate(valid => {
            if (valid) {
              let param = Object.assign({}, this.userForm);
              this.$common.setLoadingTarget(".el-dialog");
              this.$ajax({
                method: "post",
                url: "/api/User",
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
        },
        selectPosition() {
          this.$refs.selPosition.openPosition(this.userForm.CorpId,this.userForm.DeptId,this.userForm.PositionId);
        },
        callbackPosition:function (corpId, corpName, deptId, deptName, posId, posName) {
          this.userForm.CorpId = corpId;
          this.userForm.CorporationModel.CorpName = corpName;
          this.userForm.DeptId = deptId;
          this.userForm.DepartmentModel.DepartName = deptName;
          this.userForm.PositionId = posId;
          this.userForm.PositionModel.PositionName = posName;
        }
      },
      computed:{
        getPosition:function(){
          let positionValue="";
          if (this.userForm.CorporationModel.CorpName){
            positionValue=this.userForm.CorporationModel.CorpName;
          }
          if (this.userForm.DepartmentModel.DepartName){
            positionValue+='-'+this.userForm.DepartmentModel.DepartName;
          }
          if (this.userForm.PositionModel.PositionName){
            positionValue+='-'+this.userForm.PositionModel.PositionName;
          }
          return positionValue;
        }
      },
      mounted() {
        this.defalutData = Object.assign({}, this.userForm);
      },
      created() {
      }
    }
</script>

<style scoped>

</style>
