<template>
    <div class="container">
      <el-row class="searchForm">
        <el-col :span="24">
          <div class="searchItem">
            <span>公司名称：</span>
            <el-input size="small" placeholder="请输入内容" class="searchInput"></el-input>
          </div>
          <div class="searchItem">
            <span>公司名称：</span>
            <el-input size="small" placeholder="请输入内容" class="searchInput"></el-input>
          </div>
          <div class="searchItem">
            <span>公司名称：</span>
            <el-input size="small" placeholder="请输入内容" class="searchInput"></el-input>
          </div>
          <div class="searchItem">
            <span>公司名称：</span>
            <el-input size="small" placeholder="请输入内容" class="searchInput"></el-input>
          </div>
          <div class="searchItem">
            <span>公司名称：</span>
            <el-input size="small" placeholder="请输入内容" class="searchInput"></el-input>
          </div>
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
        <el-col :span="24">
          <el-button type="text" size="small" icon="el-icon-circle-plus-outline">添加</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" >修改</el-button>
          <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
        </el-col>
      </el-row>
      <div class="custom-grid-container">
        <tree-table :data="data" :columns="columns" border/>
      </div>
    </div>
</template>

<script>
  import treeTable from "@/components/common/TreeTable";
    export default {
      name: "Corporation",
      components: { treeTable },
      data() {
        return {
          columns: [
            {
              text: "事件",
              value: "event",
              width: 200
            },
            {
              text: "ID",
              value: "id"
            }
          ],
          data: []
        };
      },
      methods:{
        getList:function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Corporation",
          }).then(function(resultData) {
            if (resultData.data.status=="1")
              _this.data = resultData.data.data;
            else
              _this.$message.error(resultData.data.message);
          });
        }
      },
      mounted(){
        this.getList();
      }
    }
</script>
