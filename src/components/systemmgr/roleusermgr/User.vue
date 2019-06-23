<template>
  <div class="container">
    <el-row class="searchForm">
      <common-search :handle-get-list="this.getList" :query-param="this.queryParam"/>
    </el-row>
    <el-row class="buttonForm">
      <el-col :span="8">
        <el-button type="text" size="medium" v-if="fList.Add" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
        <el-button type="text" size="medium" v-if="fList.Edit" icon="el-icon-edit" @click="handleEdit">修改</el-button>
        <el-button type="text" size="medium" v-if="fList.Del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        <el-button type="text" size="medium" v-if="fList.UserAllocation" icon="el-icon-c-scale-to-original">角色分配</el-button>
      </el-col>
      <el-col :span="16" style="text-align:right;">
        <common-pagination ref="cPagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
      </el-col>
    </el-row>
    <div class="custom-grid-container">
      <template>
        <el-table :data="data" style="width: 100%" @sort-change="handleSort"
                  :max-height="gridHeight" size="medium" border  highlight-current-row @current-change="handleCurrentChange">
          <el-table-column prop="Code" label="用户编码" sortable width="130"></el-table-column>
          <el-table-column prop="Name" label="用户名称" sortable width="130"></el-table-column>
          <el-table-column prop="LoginName" label="登录名称" sortable  width="130"></el-table-column>
          <el-table-column prop="Tel" label="电话" width="180"></el-table-column>
          <el-table-column prop="Address" label="地址" ></el-table-column>
          <el-table-column prop="CorpName" label="所属职位" :formatter="corpFormatter"  width="220"></el-table-column>
          <el-table-column prop="CreateDate" label="创建日期" sortable :formatter="this.$format.rowDateTime"  width="130"></el-table-column>
        </el-table>
      </template>
    </div>
  </div>
</template>

<script>
    export default {
      name: "User",
      data() {
        return {
          gridHeight: $(".custom-grid-container").height(),
          data: [],
          recondTotal: 0,
          queryParam: {
            IsAdvancedQuery: false,
            WhereList: [
              {
                Title: '用户编码',
                Field: 'u.CODE',
                ParamName: 'Code',
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
                Title: '登录名称',
                Field: 'u.LOGIN_NAME',
                ParamName: 'LoginName',
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
                Title: '电话',
                Field: 'u.TELEPHONE',
                ParamName: 'Telephone',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'TextBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                IsDefaultQuery: false
              },
              {
                Title: '地址',
                Field: 'u.ADDRESS',
                ParamName: 'Addr',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'TextBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                IsDefaultQuery: false
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
                TargetName: 'PositionId',
                RelationId_1:'CorpId',
                RelationId_2:'',
                RelationId_3:'',
                IsDefaultQuery: true
              },
              {
                Title: '所属职位',
                Field: 'u.POSITION_ID',
                ParamName: 'PositionId',
                Operator: 'like',
                Value: '',
                DataType: 'String',
                ControlType: 'ComboRadioBox',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                RelationId_1:'CorpId',
                RelationId_2:'DeptId',
                RelationId_3:'',
                IsDefaultQuery: true
              }
            ],
            SortList: []
          },
          selectedRow: null,
          fList: this.$common.getFList(this.$route.params.mid)
        };
      },
      methods: {
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
        getCorp:function(){
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Corporation/TreeList",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                var whereItem=_this.getWhereItem("CorpId");
                if (whereItem) {
                  console.log(resultData.data.data.List);

                  whereItem.BinderList = resultData.data.data.List;
                }
                _this.getDept();
              }
            }
          );
        },
        getDept:function(){
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/CorpDepartPosition/DeptList",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                var whereItem=_this.getWhereItem("DeptId");
                if (whereItem) {
                  whereItem.AllBinderList = resultData.data.data.List;
                }
                _this.getPosition();
              }
            }
          );
        },
        getPosition:function(){
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/CorpDepartPosition/PositionList",
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                var whereItem=_this.getWhereItem("PositionId");
                if (whereItem) {
                  whereItem.AllBinderList = resultData.data.data.List;
                }
                _this.getList();
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
              SortValue: column.prop,
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
              url: "/api/Role?id=" + id
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
                  url: "/api/Role?id=" + this.selectedRow.Id,
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
        }
      },
      mounted() {
        this.getCorp();
        this.$nextTick(() => {
          var that = this;
          this.gridHeight = $(".custom-grid-container").height();
          // 通过捕获系统的onresize事件触发去改变原有的高度
          window.onresize = function () {
            that.gridHeight = $(".custom-grid-container").height();
          }
        });
      }
    }
</script>

<style scoped>

</style>
