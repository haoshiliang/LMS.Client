<template>
    <div class="container">
      <el-row class="buttonForm">
        <el-col :span="24">
          <el-button type="text" size="medium" v-if="fList.Add" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
          <el-button type="text" size="medium" v-if="fList.Edit" icon="el-icon-edit" @click="handleEdit">修改</el-button>
          <el-button type="text" size="medium" v-if="fList.Del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
          <el-button type="text" size="medium" v-if="fList.DeptPosition" icon="el-icon-c-scale-to-original" @click="handleDeptPostion">部门职位维护</el-button>
        </el-col>
      </el-row>
        <div class="custom-grid-container">
        <common-tree-table ref="tGrid" :data="data" :columns="columns" :isShowCheck="isShowCheck" :expandAll="true" border/>
      </div>
      <add-corp ref="addForm"/>
      <dept-position ref="deptPositionForm"/>
    </div>
</template>

<script>
  import addCorp from "@/components/systemmgr/orgmgr/CorporationAdd"
  import deptPosition from "@/components/systemmgr/orgmgr/DeptPosition"
    export default {
      name: "Corporation",
      components: { addCorp,deptPosition },
      data() {
        return {
          columns: [
            {text: "公司名称", value: "CorpName", width: 200},
            {text: "公司编号", value: "CorpCode"},
            {text: "自动编号", value: "AutomaticCode"},
            {text: "上级公司名称", value: "ParentName"}
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
            var _this = this;
            this.$ajax({
              method: "get",
              url: "/api/Corporation?id="+id
            }).then(
              function (resultData) {
                if (resultData.data.status == '1') {
                  _this.$refs.addForm.setAddForm(id, parentId, parentName, Object.assign({}, resultData.data.data));
                }
              }
            );
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
        },
        handleDeptPostion:function () {
          if (this.$refs.tGrid.selectedRow != null) {
            var id = this.$refs.tGrid.selectedRow.Id;
            this.$refs.deptPositionForm.setAddForm(id);
          }
          else {
            this.$message.info("请选择要维护部门职位的公司!");
          }
        }
      },
      mounted() {
        this.getList();
      }
    }
</script>
