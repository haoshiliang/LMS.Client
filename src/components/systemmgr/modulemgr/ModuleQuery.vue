<template>
  <div class="container" style="overflow-x: hidden;">
    <el-container style="border: 1px solid #eee">
      <el-aside width="230px" style="background-color: rgb(238, 241, 246)">
        <el-tree
          :data="data"
          node-key="Id"
          :default-expanded-keys="extendKeys"
          ref="tree"
          highlight-current
          style="background-color: rgb(238, 241, 246)"
          @node-click="handleOnClick"
          :props="defaultProps">
        </el-tree>
      </el-aside>
      <el-container>
        <div class="container" style="width:100%;">
          <el-row class="buttonForm">
            <el-col :span="8">
              <el-button type="text" size="medium" v-if="fList.Add" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
              <el-button type="text" size="medium" v-if="fList.Edit" icon="el-icon-edit" @click="handleEdit">修改</el-button>
              <el-button type="text" size="medium" v-if="fList.Del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
            </el-col>
            <el-col :span="16" style="text-align:right;">
              <common-pagination ref="cPagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
            </el-col>
          </el-row>
          <div class="custom-grid-container">
            <template>
              <el-table :data="queryList" style="width: 100%" @sort-change="handleSort"
                        :height="gridHeight" size="medium" border  highlight-current-row @current-change="handleCurrentChange">
                <el-table-column label="序号" width="50" :formatter="formatRowNum" align="center"></el-table-column>
                <el-table-column prop="ModuleName" label="模块名称" sortable width="150"></el-table-column>
                <el-table-column prop="Title" label="标题" width="150"></el-table-column>
                <el-table-column prop="Field" label="查询字段"  width="150"></el-table-column>
                <el-table-column prop="ParamName" label="参数名"  width="150"></el-table-column>
                <el-table-column prop="Field" label="操作类型"  width="150"></el-table-column>
                <el-table-column prop="DataType" label="数据类型"  width="150"></el-table-column>
                <el-table-column prop="ControlType" label="控件类型"  width="150"></el-table-column>
                <el-table-column prop="DefaultValue" label="默认查询值"  width="150"></el-table-column>
                <el-table-column prop="Field" label="操作类型"  width="150"></el-table-column>
                <el-table-column prop="IsDefaultQuery" sort-by="IS_DEFAULT_QUERY" label="是否默认查询"  sortable :formatter="this.$format.rowYesOrNo"  width="150" align="center"></el-table-column>
                <el-table-column prop="DisplayOrder" label="显示顺序" sortable width="150"></el-table-column>
                <el-table-column prop="CreateDate" label="创建日期" sortable :formatter="this.$format.rowDateTime"  width="140"></el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </el-container>
    </el-container>
    <add-module-query ref="addForm"/>
  </div>
</template>

<script>
  import addModuleQuery from "@/components/systemmgr/modulemgr/ModuleQueryAdd"
    export default {
      name: "ModuleQuery",
      components: { addModuleQuery },
      data() {
        return {
          data: [],
          queryList:[],
          gridHeight: $(".custom-grid-container").height(),
          recondTotal: 0,
          queryParam: {
            IsAdvancedQuery: false,
            WhereList: [{Title: '模块ID', Field: 'mq.ID', Operator: '=', Value: '', DataType: 'String'}],
            SortList: []
          },
          extendKeys: [],
          selectedRow: null,
          fList: this.$common.getFList(this.$route.params.mid),
          defaultProps: {
            children: 'ChildList',
            label: 'Name'
          }
        }
      },
      methods: {
        getModuleList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Module/EnableTreeList"
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.data = resultData.data.data;
                _this.extendKeys = [];
                _this.data.forEach(m => {
                  m.ChildList.forEach(c => {
                    _this.extendKeys.push(c.Id);
                  })
                });
              }
            }
          );
        },
        getList:function(){
          var _this = this;
          this.$ajax({
            method: "post",
            url: "/api/ModuleQuery/List",
            data: {paginationModel: _this.$refs.cPagination.paginationJson, queryParamModel: this.queryParam}
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.queryList = resultData.data.data.List;
                _this.recondTotal = resultData.data.data.RecordTotal;
              }
            }
          );
        },
        handleOnClick:function (d,n,obj) {
          this.queryParam.WhereList[0].Value = d.Id;
          this.getList();
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
        handleCurrentChange(val) {
          this.selectedRow = val;
        },
        formatRowNum:function(row,column,cellValue,index){
          return (this.$refs.cPagination.paginationJson.pageIndex - 1) * this.$refs.cPagination.paginationJson.pageSize + index  + 1;
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
        }
      },
      mounted() {
        this.$nextTick(() => {
          var that = this;
          this.gridHeight = $(".custom-grid-container").height();
          // 通过捕获系统的onresize事件触发去改变原有的高度
          window.onresize = function () {
            that.gridHeight = $(".custom-grid-container").height();
          }
        });
        this.getModuleList();
        this.getList();
      }
    }
</script>

<style scoped>

</style>
