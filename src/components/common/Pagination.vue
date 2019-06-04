<template>
  <el-pagination
    class="el-pagination-background"
    layout="total, sizes, prev, pager, next"
    :page-sizes="[15, 30, 50, 100]"
    :page-size="this.pageSize"
    :current-page="this.pageIndex"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :total="this.recordTotal">
  </el-pagination>
</template>

<script>
    export default {
      name: "Pagination",
      data(){
          return{
            pageIndex:1,
            pageSize:15
          }
      },
      props:{
        recordTotal:{
          type:Number,
          default:0
        },
        handleGetList:{}
      },
      methods:{
        handleSizeChange(val) {
          this.pageSize = val;
          this.pageIndex = 1;
          this.handleGetList();
        },
        handleCurrentChange(val) {
          this.pageIndex = val;
          this.handleGetList();
        }
      },
      computed:{
        paginationJson:function () {
          return JSON.stringify({pageIndex:this.pageIndex,pageSize:this.pageSize});
        }
      }
    }
</script>
<style scoped>
  .el-pagination button:disabled{
    color: transparent;
    background-color: transparent;
  }
</style>
