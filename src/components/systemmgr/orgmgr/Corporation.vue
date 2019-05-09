<template>
    <div class="container">
      <el-row class="searchForm">
        <el-col :span="24">
          <div class="searchItem">
            <span>公司名称：</span>
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
          <el-pagination
            class="el-pagination-background"
            :page-sizes="[15, 30, 50, 100]"
            :page-size="15"
            layout="total, sizes, prev, pager, next"
            :total="400">
          </el-pagination>
        </el-col>
      </el-row>
        <div class="custom-grid-container">
        <tree-table ref="tGrid" :data="data" :columns="columns" :isShowCheck="isShowCheck" :expandAll="true" border/>
      </div>
      <add-corp ref="addForm"/>
    </div>
</template>

<script>
  import treeTable from "@/components/common/TreeTable";
  import addCorp from "@/components/systemmgr/orgmgr/CorporationAdd"
    export default {
      name: "Corporation",
      components: {treeTable, addCorp},
      data() {
        return {
          columns: [
            {
              text: "公司名称",
              value: "CorpName",
              width: 200
            },
            {
              text: "公司编号",
              value: "CorpCode",

            },
            {
              text: "上级公司名称",
              value: "ParentName"
            }
          ],
          data: [],
          isShowCheck: false
        };
      },
      methods: {
        getList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Corporation"
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.data = resultData.data.data;
              }
            }
          );
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
      }
    }
</script>
