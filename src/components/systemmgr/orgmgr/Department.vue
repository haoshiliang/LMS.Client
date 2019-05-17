<template>
    <div class="container">
      <el-row class="searchForm">
        <el-col :span="24">
          <div class="searchItem">
            <span>部门名称：</span>
            <el-input size="small" placeholder="请输入内容" class="searchInput"></el-input>
          </div>
          <div class="searchButton">
            <el-button type="primary" size="small" @click="getList">查询</el-button>
          </div>
        </el-col>
      </el-row>
      <el-row class="buttonForm">
        <el-col :span="8">
          <el-button type="text" size="small" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit">修改</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete">删除</el-button>
        </el-col>
        <el-col :span="16" style="text-align:right;">
          <common-pagination ref="cPagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
        </el-col>
      </el-row>
        <div class="custom-grid-container">
          <template>
            <el-table :data="data" style="width: 100%" @sort-change="handleSort"
                       :max-height="gridHeight" size="small" border>
              <el-table-column prop="DepartCode" label="科室编码" sortable width="180"></el-table-column>
              <el-table-column prop="DepartName" label="科室名称" sortable width="180"></el-table-column>
              <el-table-column prop="CreateDate" label="创建日期" sortable :formatter="this.$format.rowDateTime"></el-table-column>
            </el-table>
          </template>
      </div>
    </div>
</template>

<script>
  import treeTable from "@/components/common/TreeTable";
  import addCorp from "@/components/systemmgr/orgmgr/CorporationAdd"
    export default {
      name: "Department",
      components: {},
      data() {
        return {
          gridHeight:$(".custom-grid-container").height(),
          data: [],
          recondTotal:0,
          queryParam:{
            WhereList:[],
            SortList:[]
          }
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
          var parentId="";
          var parentName="";
          if (this.$refs.tGrid.selectedRow != null) {
            parentId=this.$refs.tGrid.selectedRow.Id;
            parentName = this.$refs.tGrid.selectedRow.CorpName;
          }
          this.$refs.addForm.setAddForm("",parentId ,parentName , {});
        },
        handleEdit: function () {
          if (this.$refs.tGrid.selectedRow != null) {
            var id = this.$refs.tGrid.selectedRow.Id;
            var parentId = this.$refs.tGrid.selectedRow.ParentId;
            var parentName = this.$refs.tGrid.selectedRow.ParentName;
            this.$refs.addForm.setAddForm(id, parentId, parentName, Object.assign({}, this.$refs.tGrid.selectedRow));
          }
          else {
            this.$message.info("请选择要修改的行!");
          }
        },
        handleDelete: function () {
          if (this.$refs.tGrid.selectedRow != null) {
            this.$confirm("确认删除该记录吗?", "提示", {type: "warning"})
              .then(() => {
                this.$ajax({
                  method: "delete",
                  url: "/api/Corporation?id="+this.$refs.tGrid.selectedRow.Id,
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
