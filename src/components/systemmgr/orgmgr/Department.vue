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
        </el-col>
        <el-col :span="16" style="text-align:right;">
          <common-pagination ref="cPagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
        </el-col>
      </el-row>
        <div class="custom-grid-container">
          <template>
            <el-table :data="data" style="width: 100%" @sort-change="handleSort"
                       :max-height="gridHeight" size="medium" border  highlight-current-row @current-change="handleCurrentChange">
              <el-table-column label="序号" width="50" :formatter="formatRowNum" align="center"></el-table-column>
              <el-table-column prop="DepartCode" label="科室编码" sortable width="180"></el-table-column>
              <el-table-column prop="DepartName" label="科室名称" sortable width="180"></el-table-column>
              <el-table-column prop="CreateDate" label="创建日期" sortable :formatter="this.$format.rowDateTime"></el-table-column>
            </el-table>
          </template>
      </div>
      <add-dept ref="addForm"/>
    </div>
</template>

<script>
  import addDept from "@/components/systemmgr/orgmgr/DepartmentAdd"
    export default {
      name: "Department",
      components: {addDept},
      data() {
        return {
          gridHeight:$(".custom-grid-container").height(),
          data: [],
          recondTotal:0,
          queryParam:{
            IsAdvancedQuery:false,
            WhereList:[],
            SortList:[]
          },
          selectedRow:null,
          fList: this.$common.getFList(this.$route.params.mid)
        };
      },
      methods: {
        getWhereList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/ModuleQuery/GetSearchList?moduleId="+this.$route.params.mid+"&userId="+this.$common.getSessionStorage("userId"),
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                console.log(resultData.data.data);
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
            url: "/api/Department/List",
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
        handleSort:function(column){
          var sortLen=this.queryParam.SortList.length;
          if (sortLen>0){
            this.queryParam.SortList.splice(0,sortLen);
          }
          if (column.prop!=null)
          {
            this.queryParam.SortList.push({SortValue:column.prop,SortType:(column.order==='ascending'?'asc':'desc')})
          }
          this.getList();
        },
        handleAdd: function () {
          this.$refs.addForm.setAddForm("" , {});
        },
        handleEdit: function () {
          if (this.selectedRow != null) {
            var _this = this;
            var id = this.selectedRow.Id;
            this.$ajax({
              method: "get",
              url: "/api/Department?id="+id
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
                  url: "/api/Department?id="+this.selectedRow.Id,
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
        formatRowNum:function(row,column,cellValue,index){
          return (this.$refs.cPagination.paginationJson.pageIndex - 1) * this.$refs.cPagination.paginationJson.pageSize + index  + 1;
        }
      },
      mounted() {
        this.getWhereList();
        this.$nextTick(() => {
          var that = this;
          this.gridHeight = $(".custom-grid-container").height();
          // 通过捕获系统的onresize事件触发去改变原有的高度
          window.onresize = function() {
            that.gridHeight = $(".custom-grid-container").height();
          }
        });
      }
    }
</script>
