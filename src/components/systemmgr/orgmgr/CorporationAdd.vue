<template>
  <div v-if="addFormVisible">
    <el-dialog :title="title" :visible.sync="addFormVisible"  width="600px" :close-on-click-modal="false">
      <el-form :model="corpForm" ref="corpForm" label-width="80px" :rules="corpRules">
        <el-form-item label="公司父级" prop="ParentId">
          <select-tree v-model="corpForm.ParentId" :showText="corpForm.ParentCorp.CorpName" :options="corpList" :props="defaultProps" />
        </el-form-item>
        <el-form-item label="公司编码"  prop="CorpCode">
          <el-input auto-complete="off" placeholder="公司编码" v-model="corpForm.CorpCode"></el-input>
        </el-form-item>
        <el-form-item label="公司名称"  prop="CorpName">
          <el-input auto-complete="off" placeholder="公司名称" v-model="corpForm.CorpName"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SelectTree from '@/components/common/SelectTree.vue';
    export default {
      name: "CorporationAdd",
      components: {SelectTree},
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
            CorpCode: [{required: true, message: '请输入公司编码', trigger: 'blur'}],
            CorpName: [{required: true, message: '请输入公司名称', trigger: 'blur'}]
          },
          corpList: [],
          corpForm: {
            Id:'',
            OldParentId:'',
            ParentId: '',
            ParentCorp: {CorpName:''},
            CorpCode: '',
            CorpName: '',
            AutomaticCode:''
          },
          title: "",
          addFormVisible: false,
        }
      },
      methods: {
        async getCorpList() {
          var _this = this;
          var res = await this.$ajax({
            method: "get",
            url: "/api/Corporation?id="+this.corpForm.Id+"&isTree=true"
          });
          if (res.data.status == '1') {
            _this.corpList = res.data.data;
            this.addFormVisible = true;
          }
        },
        resetForm: function () {
          if (this.$refs["corpForm"])
            this.$refs["corpForm"].resetFields();
        },
        setAddForm: function (id, parentId, parentName,editFormData) {
          this.resetForm();
          if (id != "") {
            this.title = "修改公司信息";
            this.corpForm = editFormData;
            this.corpForm.OldParentId = parentId;
          } else {
            this.title = "添加公司信息";
            this.corpForm.Id="";
            this.corpForm.CorpCode="";
            this.corpForm.CorpName="";
          }
          this.getCorpList();
          this.corpForm.ParentId = parentId;
          this.corpForm.ParentCorp.CorpName = parentName;
        },
        submitForm: function () {
          this.$refs.corpForm.validate(valid => {
            if (valid) {
              let param = Object.assign({}, this.corpForm);
              if (param.ChildList){
                delete param.ChildList;
              }
              if(param.parent){
                delete param.parent;
              }
              this.$ajax({
                method: "post",
                url: "/api/Corporation",
                data: param
              }).then(res => {
                if (res.data.status == "1") {
                  this.$message({message: "提交成功", type: "success"});
                  this.$parent.getList();
                  this.closeForm();
                }
              });
            }
          });
        },
        closeForm: function () {
          this.addFormVisible = false;
        }
      },
      mounted() {
      },
      created() {
      }
    }
</script>

<style scoped>

</style>
