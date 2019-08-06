<template>
  <div v-if="addFormVisible">
    <el-dialog ref="dailog" title="角色模块维护" :visible.sync="addFormVisible" width="450px" :close-on-click-modal="false">
      <div style="height: 400px; overflow-y: auto; overflow-x: hidden">
        <el-tree
          :data="roleModuleList"
          show-checkbox
          node-key="Id"
          :default-expanded-keys="extendKeys"
          :default-checked-keys="checkedKeys"
          ref="tree"
          highlight-current
          :props="defaultProps">
        </el-tree>
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
      name: "RoleModuleAdd",
      data() {
        return {
          roleModuleList: [],
          addFormVisible: false,
          roleId: '',
          extendKeys: [],
          checkedKeys: [],
          defaultProps: {
            children: 'ChildList',
            label: 'Name'
          }
        }
      },
      methods: {
        setAddForm: function (id) {
          this.addFormVisible = true;
          this.roleId = id;
          setTimeout(() => {
            this.getList();
            this.getRoleModule(id);
          }, 200);
        },
        getList: function () {
          this.$common.setLoadingTarget(".el-dialog");
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/ModuleFunction"
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.roleModuleList = resultData.data.data;
                _this.extendKeys = [];
                _this.roleModuleList.forEach(m => {
                  m.ChildList.forEach(c => {
                    _this.extendKeys.push(c.Id);
                  })
                });
              }
            }
          );
        },
        getRoleModule: function (roleId) {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/RoleModule?roleId=" + roleId
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.$refs.tree.setCheckedKeys(resultData.data.data);
              }
            }
          );
        },
        submitForm: function () {
          let param={};
          let selRoleMouleList = [];
          let checkKeys = this.$refs.tree.getCheckedKeys();
          if (checkKeys.length > 0) {
            for (var i = 0, len = checkKeys.length; i < len; i++) {
              selRoleMouleList.push({RoleId: this.roleId, ModuleId: checkKeys[i]});
            }
          }
          param[this.roleId] = selRoleMouleList;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "post",
            url: "/api/RoleModule",
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

</style>
