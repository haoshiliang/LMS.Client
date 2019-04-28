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
        <el-col :span="8">
          <el-button type="text" size="small" icon="el-icon-circle-plus-outline">添加</el-button>
          <el-button type="text" size="small" icon="el-icon-edit" >修改</el-button>
          <el-button type="text" size="small" icon="el-icon-delete">删除</el-button>
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
              text: "公司编号",
              value: "CorpCode",
              width: 200
            },
            {
              text: "公司名称",
              value: "CorpName"
            },
            {
              text: "上级公司名称",
              value: "ParentName"
            }
          ],
          data: []
        };
      },
      methods:{
        openLoading:function () {
          this.$common.openLoading();
          setTimeout(() => {
            this.$common.closeLoading();
          }, 2000);
        },
        getList: function() {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Corporation"
          }).then(
            function(resultData) {
              if (resultData.data.status=='1'){
                _this.data = resultData.data.data;
              }
            }
          );

        }
      },
      mounted(){
        this.getList();
      }
    }
</script>
