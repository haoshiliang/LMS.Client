<template>
  <div>
    <el-form :model="corpForm" ref="corpForm" label-width="80px" :rules="corpRules">
      <el-form-item label="公司父级" prop="parentId">
        <select-tree v-model="corpForm.parentId" :options="corpList" :props="defaultProps" />
      </el-form-item>
      <el-form-item label="公司编码"  prop="corpCode">
        <el-input auto-complete="off" prop="corpCode" placeholder="公司编码" v-model="corpForm.corpCode"></el-input>
      </el-form-item>
      <el-form-item label="公司名称"  prop="corpName">
        <el-input auto-complete="off" prop="corpName" placeholder="公司名称" v-model="corpForm.corpName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">提交</el-button>
      <el-button @click="resetForm">重置</el-button>
      <el-button @click="closeForm">取消</el-button>
    </div>
  </div>
</template>

<script>
  import SelectTree from '@/components/common/SelectTree.vue';
    export default {
      name: "CorporationAdd",
      components: {
        SelectTree
      },
      data() {
        return {
          // 数据默认字段
          defaultProps: {
            parent: 'ParentId',   // 父级唯一标识
            value: 'Id',          // 唯一标识
            label: 'CorpName',       // 标签显示
            children: 'ChildList'
          },
          corpRules: {
            corpCode: [{required: true, message: '请输入公司编码', trigger: 'blur'}],
            corpName: [{required: true, message: '请输入公司名称', trigger: 'blur'}]
          },
          corpList: [],
          corpForm: {
            parentId: '',
            corpCode: '',
            corpName: ''
          }
        }
      },
      methods: {
        getCorpList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Corporation?id=&isTree=true"
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                console.log("获取公司列表!");
                console.log(resultData.data.data);
                _this.corpList = resultData.data.data;
              }
            }
          );
        },
        resetForm: function () {
          this.$refs["corpForm"].resetFields();
        },
        submitForm: function () {
          this.$refs.corpForm.validate(valid => {
            if (valid) {
              let param = Object.assign({}, this.corpForm);
              this.$ajax({
                method: "post",
                url: "/api/Corporation",
                data: param
              }).then(res => {
                if (res.data.status=="1"){
                  this.$message({ message: "提交成功", type: "success"});
                  this.$refs["corpForm"].resetFields();
                  this.$parent.getList();
                  this.closeForm();
                }
                else{
                  this.$message({ message: res.data.message, type: "error"});
                }
              });
            }
          });
        },
        closeForm: function () {
          this.$refs["corpForm"].resetFields();
          this.$parent.handleClose();
        }
      },
      mounted() {
        this.getCorpList();
      },
      created() {
      }
    }
</script>

<style scoped>

</style>
