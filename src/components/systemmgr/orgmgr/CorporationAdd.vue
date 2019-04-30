<template>
  <div>
    <el-form :model="corpForm" ref="corpForm" label-width="80px">
      <el-form-item label="公司父级">
        <el-select filterable placeholder="请选择"  v-model="corpForm.parentId">
          <el-option v-for="item in corpList" :key="item.value" :label="item.text" :value="item.value" prop="parentId"/>
        </el-select>
      </el-form-item>
      <el-form-item label="公司编码">
        <el-input auto-complete="off" prop="corpCode" placeholder="公司编码" v-model="corpForm.corpCode"></el-input>
      </el-form-item>
      <el-form-item label="公司名称">
        <el-input auto-complete="off" prop="corpName" placeholder="公司名称" v-model="corpForm.corpName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" :loading="addLoading">提交</el-button>
      <el-button @click="resetForm('corpForm')">重置</el-button>
      <el-button>取消</el-button>
    </div>
  </div>
</template>

<script>
    export default {
        name: "CorporationAdd",
      data(){
        return {
          addLoading:false,
          corpList:[{value:'1',text:'测试'}],
          corpForm:{
            parentId:'',
            corpCode:'',
            corpName:''
          }
        }
      },
      methods:{
        resetForm(formName) {
          this.$refs[formName].resetFields();
        }
      }
    }
</script>

<style scoped>

</style>
