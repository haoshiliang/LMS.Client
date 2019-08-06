<template>
  <div v-if="addFormVisible">
    <el-dialog ref="dailog" title="用户角色维护" :visible.sync="addFormVisible" width="700px" :close-on-click-modal="false">
      <div style="height: 300px; overflow-y: auto; overflow-x: hidden">
        <el-checkbox-group v-model="checkedRoles">
          <el-checkbox v-for="role in roleList" v-model="role.Id" :label="role.Id" :key="role.Id">{{role.RoleName}}</el-checkbox>
        </el-checkbox-group>
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
      name: "UserRoleAdd",
      data() {
        return {
          checkedRoles: [],
          roleList: [],
          addFormVisible: false,
          userId: ''
        }
      },
      methods: {
        setAddForm: function (id) {
          this.addFormVisible = true;
          this.userId = id;
          setTimeout(() => {
            this.getList();
            this.getUserRole(id);
          }, 200);
        },
        getList: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/Role"
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.roleList = resultData.data.data;
                _this.addFormVisible = true;
              }
            }
          );
        },
        getUserRole: function (userId) {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/UserRole/GetByUserId?userId=" + userId
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.checkedRoles = resultData.data.data;
              }
            }
          );
        },
        submitForm: function () {
          let param = [];
          if(this.checkedRoles.length>0) {
            for (var i = 0, len = this.checkedRoles.length; i < len; i++) {
              param.push({UserId: this.userId, RoleId: this.checkedRoles[i], IsRoleMaster: false});
            }
          }else {
            param.push({UserId: this.userId, RoleId: '', IsRoleMaster: false});
          }
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "post",
            url: "/api/UserRole",
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
  .el-checkbox{
    min-width: 130px;
    margin-bottom:5px;
  }
</style>
