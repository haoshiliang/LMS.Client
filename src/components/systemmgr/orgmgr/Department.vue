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
            WhereList:[
              {Title:'科室编码',Field:'DepartCode',Operator:'like',Value:'',DataType:'String',ControlType:'TextBox',BinderList:[],IsDefaultQuery:true},
              {Title:'部门名称',Field:'DepartName|PyCode',Operator:'like',Value:'',DataType:'String',ControlType:'TextBox',BinderList:[],IsDefaultQuery:true}
              ],
            SortList:[]
          },
          selectedRow:null,
          fList: this.$common.getFList(this.$route.params.mid)
        };
      },
      methods: {
        getList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Department?pagination="+encodeURI(_this.$refs.cPagination.paginationJson)+"&queryParam="+encodeURI(JSON.stringify(this.queryParam))
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
        }
      },
      mounted() {
        this.getList();
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
