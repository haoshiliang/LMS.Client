<template>
  <div class="container">
    <el-row class="searchForm">
      <common-search :handle-get-list="this.getList" :query-param="this.queryParam"/>
    </el-row>
    <div class="custom-grid-container" id="custom-grid-container">
        <el-table :data="data" style="width: 100%;" @sort-change="handleSort"
                   :height = "gridHeight" size="medium" border  highlight-current-row @current-change="handleCurrentChange">
          <el-table-column label="序号" width="80" :formatter="formatRowNum" align="center"></el-table-column>
          <el-table-column prop="Code" label="用户编码" sortable width="150"></el-table-column>
          <el-table-column prop="Name" label="用户名称" sortable width="150"></el-table-column>
          <el-table-column prop="LoginName" label="登录名称" sortable  width="150"></el-table-column>
          <el-table-column prop="IsEnable" sort-by="Enable" label="用户状态"  sortable :formatter="this.$format.rowEnabled"  width="110" align="center"></el-table-column>
          <el-table-column prop="Tel" label="电话"></el-table-column>
          <el-table-column prop="IsSuperAdmin" label="超级管理员" :formatter="this.$format.rowYesOrNo" align="center" width="130"></el-table-column>
          <el-table-column prop="CorpName" label="所属职位" :formatter="corpFormatter"  width="250"></el-table-column>
          <el-table-column prop="CreateDate" label="创建日期" sortable :formatter="this.$format.rowDateTime"  width="140"></el-table-column>
        </el-table>
    </div>
    <el-row class="buttonForm">
      <el-col :span="8">
        <el-button type="text" size="medium" v-if="fList.Add" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
        <el-button type="text" size="medium" v-if="fList.Edit" icon="el-icon-edit" @click="handleEdit">修改</el-button>
        <el-button type="text" size="medium" v-if="fList.Del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        <el-button type="text" size="medium" v-if="fList.UserAllocation" icon="el-icon-c-scale-to-original" @click="handleAddUserRole">角色分配</el-button>
      </el-col>
      <el-col :span="16" style="text-align:right;">
        <common-pagination ref="cPagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
      </el-col>
    </el-row>    
    <add-user ref="addForm"/>
    <add-user-role ref="addUserRole"/>
  </div>
</template>

<script>
  import addUser from "@/components/systemmgr/roleusermgr/UserAdd"
  import addUserRole from "@/components/systemmgr/roleusermgr/UserRoleAdd"
    export default {
      name: "User",
      components:{addUserRole, addUser },
      data() {
        return {
          gridHeight: $("#custom-grid-container").height(),
          data: [],
          timer:false,
          recondTotal: 0,
          queryParam: {
            IsAdvancedQuery: false,
            WhereList: [],
            SortList: []
          },
          selectedRow: null,
          fList: this.$common.getFList(this.$route.params.mid)
        };
      },
      methods: {
        getWhereList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/ModuleQuery/GetSearchList?moduleId="+this.$route.params.mid,
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.queryParam = resultData.data.data;
                _this.getList();
              }
            }
          );
        },
        getList: function () {
          var _this = this;
          this.$ajax({
            method: "post",
            url: "/api/User/List",
            data: {paginationModel: _this.$refs.cPagination.paginationJson, queryParamModel: this.queryParam}
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.data = resultData.data.data.List;
                _this.recondTotal = resultData.data.data.RecordTotal;
              }
            }
          );
        },
        getWhereItem:function (targetName) {
          var whereValue = null;
          if (targetName != "") {
            for (var i = 0, len = this.queryParam.WhereList.length; i < len; i++) {
              if (this.queryParam.WhereList[i].ParamName === targetName) {
                whereValue = this.queryParam.WhereList[i];
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
              SortValue: column.column.sortBy?column.column.sortBy:column.prop,
              SortType: (column.order === 'ascending' ? 'asc' : 'desc')
            })
          }
          this.getList();
        },
        handleAdd: function () {
          this.$refs.addForm.setAddForm("", {});
        },
        handleEdit: function () {
          if (this.selectedRow != null) {
            var _this = this;
            var id = this.selectedRow.Id;
            this.$ajax({
              method: "get",
              url: "/api/User?id=" + id
            }).then(
              function (resultData) {
                if (resultData.data.status == '1') {
                  _this.$refs.addForm.setAddForm(id, Object.assign({}, resultData.data.data));
                }
              }
            );
          }
          else {
            this.$message.info("请选择要修改的行!");
          }
        },
        handleDelete: function () {
          if (this.selectedRow != null) {
            this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
              .then(() => {
                this.$ajax({
                  method: "delete",
                  url: "/api/User?id=" + this.selectedRow.Id,
                }).then(res => {
                  if (res.data.status == "1") {
                    this.$message({message: "删除成功", type: "success"});
                    this.getList();
                  }
                });
              }).catch(() => {
            });
          }
          else {
            this.$message.info("请选择要删除的行!");
          }
        },
        handleCurrentChange(val) {
          this.selectedRow = val;
        },
        corpFormatter: function (row, column, cellValue) {
          return row.CorpName + "-" + row.DeptName + "-" + row.PositionName;
        },
        formatRowNum:function(row,column,cellValue,index){
          return (this.$refs.cPagination.paginationJson.pageIndex - 1) * this.$refs.cPagination.paginationJson.pageSize + index  + 1;
        },
        handleAddUserRole:function () {
          if (this.selectedRow != null) {
            if (this.selectedRow.IsSuperAdmin==true){
              this.$message.info("超级管理员无需设置角色,有全部模块权限!");
            } else {
              this.$refs.addUserRole.setAddForm(this.selectedRow.Id);
            }
          }
          else {
            this.$message.info("请选择要设置角色的行!");
          }
        }
      },
      mounted() {
        this.getWhereList();

        var elementResizeDetectorMaker = require("element-resize-detector");//导入
        var _this = this;
        var erd = elementResizeDetectorMaker();
        erd.listenTo(document.getElementById("custom-grid-container"), element => {
          _this.$nextTick(() => {
            _this.gridHeight = element.offsetHeight;
          });
        });     
      }
    }
</script>

<style scoped>

</style>
