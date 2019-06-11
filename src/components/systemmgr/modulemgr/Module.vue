<template>
    <div class="container">
      <el-row class="buttonForm">
        <el-col :span="24">
          <el-button type="text" size="medium" v-if="fList.Add" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
          <el-button type="text" size="medium" v-if="fList.Edit" icon="el-icon-edit" @click="handleEdit">修改</el-button>
          <el-button type="text" size="medium" v-if="fList.Del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          <el-button type="text" size="medium" v-if="fList.ModuleFunction" icon="el-icon-delete" @click="handleModuleFunction">模块功能维护</el-button>
        </el-col>
      </el-row>
        <div class="custom-grid-container">
        <common-tree-table ref="tGrid" :data="data" :columns="columns" :isShowCheck="isShowCheck" :expandAll="true" border/>
      </div>
      <add-module ref="addForm"/>
      <add-module-function ref="addMFForm"/>
    </div>
</template>

<script>
  import addModule from "@/components/systemmgr/modulemgr/ModuleAdd"
  import addModuleFunction from "@/components/systemmgr/modulemgr/ModuleFunctionAdd"
    export default {
      name: "Module",
      components: { addModule,addModuleFunction },
      data() {
        return {
          columns: [
            {text: "模块名称", value: "Name", width: 200},
            {text: "模块编号", value: "Code"},
            {text: "父模块", value: "ParentName"},
            {text:"显示图标",value:"Icon"},
            {text:"模块路径",value:"ModulePath"},
            {text:"模块状态",value:"IsEnabled",formatter:function (cellValue) {return cellValue=="1"?"启用":"禁用";}}
          ],
          data: [],
          isShowCheck: false,
          fList: this.$common.getFList(this.$route.params.mid)
        };
      },
      methods: {
        getList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Module"
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
            this.$ajax({
              method: "get",
              url: "/api/Module?id="+this.$refs.tGrid.selectedRow.Id,
            }).then(res => {
              if (res.data.status == "1") {
                this.$refs.addForm.setAddForm(id, parentId, parentName, res.data.data);
              }
            });
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
                  url: "/api/Module?id="+this.$refs.tGrid.selectedRow.Id,
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
        handleModuleFunction: function () {
          var _this = this;
          if (this.$refs.tGrid.selectedRow != null) {
            this.$ajax({
              method: "get",
              url: "/api/Function?id="+this.$refs.tGrid.selectedRow.Id
            }).then(
              function (resultData) {
                if (resultData.data.status == '1') {
                  _this.$refs.addMFForm.setAddForm(_this.$refs.tGrid.selectedRow.Id, resultData.data.data);
                }
              }
            );
          }
          else {
            this.$message.info("请选择要添加功能的行!");
          }
        }
      },
      mounted() {
        this.getList();
      }
    }
</script>
