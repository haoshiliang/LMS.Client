<template>
  <div v-if="addFormVisible">
    <el-dialog  v-dialogDrag ref="dailog" title="角色用户维护" :visible.sync="addFormVisible" width="910px" :close-on-click-modal="false">
      <div style="height: 400px; overflow-y: auto; overflow-x: hidden; margin:-22px -15px;width:900px;">
        <el-tabs type="border-card" v-model="activeTabName" @tab-click="handleTabClick">
          <el-tab-pane label="已分配用户" name="allocateUsers" style="margin:-15px;">
            <el-row class="searchForm">
              <common-search :handle-get-list="this.getList" :query-param="this.queryParam" :isShowdvanced="false" size="small"/>
            </el-row>
            <el-row class="buttonForm">
                <common-pagination ref="cAllocatePagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
            </el-row>
            <div class="custom-grid-container">
            <el-table :data="allocateList" style="width: 100%" @sort-change="handleSort" size="small" height="270" border  highlight-current-row @selection-change="handleSelectionChange">
              <el-table-column  type="selection" width="34"></el-table-column>
              <el-table-column label="序号" width="50" :formatter="formatRowNum" align="center"></el-table-column>
              <el-table-column prop="Code" label="用户编码" sortable width="150"></el-table-column>
              <el-table-column prop="Name" label="用户名称" sortable width="150"></el-table-column>
              <el-table-column prop="Tel" label="电话"></el-table-column>
              <el-table-column prop="CorpName" label="所属职位" :formatter="corpFormatter"  width="250"></el-table-column>
              <el-table-column prop="CreateDate" label="创建日期" sortable :formatter="this.$format.rowDateTime"  width="140"></el-table-column>
            </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane label="未分配用户" name="noAllocateUsers" style="margin:-15px;">
            <el-row class="searchForm">
              <common-search :handle-get-list="this.getNoList" :query-param="this.queryParamNo" :isShowdvanced="false" size="small"/>
            </el-row>
            <el-row class="buttonForm">
              <common-pagination ref="cNoPagination" :handle-get-list="this.getNoList" :record-total="this.recondTotalNo"/>
            </el-row>
            <div class="custom-grid-container">
              <el-table :data="noAllocateList" style="width: 100%" @sort-change="handleSortNo" size="small" height="270" border  highlight-current-row @selection-change="handleSelectionChangeNo">
                <el-table-column  type="selection" width="34"></el-table-column>
                <el-table-column label="序号" width="50" :formatter="formatRowNumNo" align="center"></el-table-column>
                <el-table-column prop="Code" label="用户编码" sortable width="150"></el-table-column>
                <el-table-column prop="Name" label="用户名称" sortable width="150"></el-table-column>
                <el-table-column prop="Tel" label="电话"></el-table-column>
                <el-table-column prop="CorpName" label="所属职位" :formatter="corpFormatter"  width="250"></el-table-column>
                <el-table-column prop="CreateDate" label="创建日期" sortable :formatter="this.$format.rowDateTime"  width="140"></el-table-column>
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleAddRoleAdd" v-if="isShowAdd">添加</el-button>
        <el-button type="danger" @click="handleDelRoleUser" v-if="isShowAdd==false">删除</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "RoleUserAdd",
      data() {
        return {
          allocateList: [],
          noAllocateList: [],
          checkedRoles: [],
          roleList: [],
          noRoleList:[],
          addFormVisible: false,
          roleId: '',
          isShowAdd: false,
          activeTabName: 'allocateUsers',
          recondTotal: 0,
          queryParam: {
            IsAdvancedQuery: false,
            WhereList: [
              {
                Title: '角色编号',
                Field: '',
                ParamName: 'RoleId',
                Operator: 'Exists',
                Value: '',
                DataType: 'String',
                ControlType: '',
                Exists: "EXISTS(SELECT 1 FROM SYS_ROLE_USER ru WHERE ru.USER_ID=u.ID AND ru.ROLE_ID=@RoleId)",
                IsDefaultQuery: true
              },
              {
                Title: '用户名称',
                Field: 'u.NAME|u.PY_CODE',
                ParamName: 'Name',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'TextBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                IsDefaultQuery: true
              },
              {
                Title: '用户状态',
                Field: 'u.IS_ENABLE',
                ParamName: 'IsEnable',
                Operator: '=',
                Value: '1',
                DataType: 'String',
                ControlType: '',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                IsDefaultQuery: true
              },
              {
                Title: '所属公司',
                Field: 'u.CORP_ID',
                ParamName: 'CorpId',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'ComboTreeBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: 'DeptId',
                IsDefaultQuery: true
              },
              {
                Title: '所属部门',
                Field: 'u.DEPT_ID',
                ParamName: 'DeptId',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'ComboRadioBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                RelationId_1: 'CorpId',
                RelationId_2: '',
                RelationId_3: '',
                IsDefaultQuery: true
              }
            ],
            SortList: []
          },
          recondTotalNo: 0,
          queryParamNo: {
            IsAdvancedQuery: false,
            WhereList: [
              {
                Title: '角色编号',
                Field: '',
                ParamName: 'RoleId',
                Operator: 'Exists',
                Value: '',
                DataType: 'String',
                ControlType: '',
                Exists: "NOT EXISTS(SELECT 1 FROM SYS_ROLE_USER ru WHERE ru.USER_ID=u.ID AND ru.ROLE_ID=@RoleId)",
                IsDefaultQuery: true
              },
              {
                Title: '系统管理员',
                Field: 'u.IS_SUPER_ADMIN',
                ParamName: 'IsSuperAdmin',
                Operator: '=',
                Value: '0',
                DataType: 'String',
                ControlType: '',
                IsDefaultQuery: true
              },
              {
                Title: '用户名称',
                Field: 'u.NAME|u.PY_CODE',
                ParamName: 'Name',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'TextBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                IsDefaultQuery: true
              },
              {
                Title: '用户状态',
                Field: 'u.IS_ENABLE',
                ParamName: 'IsEnable',
                Operator: '=',
                Value: '1',
                DataType: 'String',
                ControlType: '',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                IsDefaultQuery: true
              },
              {
                Title: '所属公司',
                Field: 'u.CORP_ID',
                ParamName: 'CorpId',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'ComboTreeBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: 'DeptId',
                IsDefaultQuery: true
              },
              {
                Title: '所属部门',
                Field: 'u.DEPT_ID',
                ParamName: 'DeptId',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'ComboRadioBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                RelationId_1: 'CorpId',
                RelationId_2: '',
                RelationId_3: '',
                IsDefaultQuery: true
              }
            ],
            SortList: []
          },
        }
      },
      methods: {
        setAddForm: function (id) {
          this.addFormVisible = true;
          this.roleId = id;
          this.activeTabName = 'allocateUsers';
          this.queryParam.WhereList[0].Value=id;
          this.queryParamNo.WhereList[0].Value=id;
          setTimeout(() => {
            this.getCorp();
            this.getDept();
            this.getList();
          }, 200);
        },
        handleTabClick: function (tab, event) {
          if (tab.name == 'allocateUsers') {
            this.isShowAdd = false;
            this.getList();
          } else {
            this.isShowAdd = true;
            this.getNoList();
          }
        },
        getList: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "post",
            url: "/api/User/List",
            data: {paginationModel: _this.$refs.cAllocatePagination.paginationJson, queryParamModel: this.queryParam}
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.allocateList = resultData.data.data.List;
                _this.recondTotal = resultData.data.data.RecordTotal;
              }
            }
          );
        },
        getNoList: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "post",
            url: "/api/User/List",
            data: {paginationModel: _this.$refs.cNoPagination.paginationJson, queryParamModel: this.queryParamNo}
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.noAllocateList = resultData.data.data.List;
                _this.recondTotalNo = resultData.data.data.RecordTotal;
              }
            }
          );
        },
        closeForm: function () {
          this.addFormVisible = false;
        },
        corpFormatter: function (row, column, cellValue) {
          return row.CorpName + "-" + row.DeptName + "-" + row.PositionName;
        },
        formatRowNum: function (row, column, cellValue, index) {
          return (this.$refs.cAllocatePagination.paginationJson.pageIndex - 1) * this.$refs.cAllocatePagination.paginationJson.pageSize + index + 1;
        },
        formatRowNumNo: function (row, column, cellValue, index) {
          return (this.$refs.cNoPagination.paginationJson.pageIndex - 1) * this.$refs.cNoPagination.paginationJson.pageSize + index + 1;
        },
        getCorp: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/Corporation/TreeList",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                var whereItem = _this.getWhereItem(_this.queryParam, "CorpId");
                if (whereItem) {
                  whereItem.BinderList = resultData.data.data;
                }
                whereItem = _this.getWhereItem(_this.queryParamNo, "CorpId");
                if (whereItem) {
                  whereItem.BinderList = resultData.data.data;
                }
              }
            }
          );
        },
        getDept: function () {
          var _this = this;
          this.$common.setLoadingTarget(".el-dialog");
          this.$ajax({
            method: "get",
            url: "/api/CorpDepartPosition/DeptList",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                var whereItem = _this.getWhereItem(_this.queryParam, "DeptId");
                if (whereItem) {
                  whereItem.AllBinderList = resultData.data.data;
                }
                whereItem = _this.getWhereItem(_this.queryParamNo, "DeptId");
                if (whereItem) {
                  whereItem.AllBinderList = resultData.data.data;
                }
              }
            }
          );
        },
        getWhereItem: function (queryParam, targetName) {
          var whereValue = null;
          if (targetName != "") {
            for (var i = 0, len = queryParam.WhereList.length; i < len; i++) {
              if (queryParam.WhereList[i].ParamName === targetName) {
                whereValue = queryParam.WhereList[i];
                break;
              }
            }
          }
          return whereValue;
        },
        handleSort: function (column) {
          var sortLen = this.queryParam.SortList.length;
          if (sortLen > 0) {
            this.queryParam.SortList.splice(0, sortLen);
          }
          if (column.prop != null) {
            this.queryParam.SortList.push({
              SortValue: column.column.sortBy ? column.column.sortBy : column.prop,
              SortType: (column.order === 'ascending' ? 'asc' : 'desc')
            })
          }
          this.getList();
        },
        handleSortNo: function (column) {
          var sortLen = this.queryParamNo.SortList.length;
          if (sortLen > 0) {
            this.queryParamNo.SortList.splice(0, sortLen);
          }
          if (column.prop != null) {
            this.queryParamNo.SortList.push({
              SortValue: column.column.sortBy ? column.column.sortBy : column.prop,
              SortType: (column.order === 'ascending' ? 'asc' : 'desc')
            })
          }
          this.getNoList();
        },
        handleSelectionChange(val) {
          this.roleList = [];
          for(var r in val){
            this.roleList.push({RoleId:this.roleId,UserId:val[r].Id});
          }
        },
        handleSelectionChangeNo(val) {
          this.noRoleList = [];
          for(var r in val){
            this.noRoleList.push({RoleId:this.roleId,UserId:val[r].Id});
          }
        },
        handleDelRoleUser: function () {
          if (this.roleList.length==0){
            this.$message.info("请选择要删除的用户!");
          } else {
            this.$confirm("确认删除用户吗?", "提示", {type: "warning"})
              .then(() => {
                this.$common.setLoadingTarget(".el-dialog");
                this.$ajax({
                  method: "post",
                  url: "/api/UserRole/DelRoleUser",
                  data: this.roleList
                }).then(res => {
                  if (res.data.status == "1") {
                    this.$message({message: "删除成功", type: "success"});
                    this.getList();
                  }
                  else {
                    this.$message({message: res.data.message, type: "error"});
                  }
                });
              }).catch(() => {
            });
          }
        },
        handleAddRoleAdd: function () {
          if (this.noRoleList.length==0){
            this.$message.info("请选择要添加的用户!");
          } else {
            this.$confirm("确认添加用户吗?", "提示", {type: "warning"})
              .then(() => {
                this.$common.setLoadingTarget(".el-dialog");
                this.$ajax({
                  method: "post",
                  url: "/api/UserRole/AddRoleUser",
                  data: this.noRoleList
                }).then(res => {
                  if (res.data.status == "1") {
                    this.$message({message: "添加成功", type: "success"});
                    this.activeTabName = "allocateUsers";
                    this.getList();
                  }
                  else {
                    this.$message({message: res.data.message, type: "error"});
                  }
                });
              }).catch(() => {
            });
          }
        },
      },
      mounted() {
      },
      created() {
      }
    }
</script>

<style scoped>
</style>
