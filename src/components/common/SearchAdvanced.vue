<template>
  <div v-if="showAdvancedQuery">
    <el-dialog  v-dialogDrag title="高级查询" :visible.sync="showAdvancedQuery" :width="dialogWidth" :close-on-click-modal="false">
      <el-row>
        <el-col :span="24">
          <template v-for="field in this.queryParam.WhereList">
            <div class="searchItem" v-if="field.ControlType=='TextBox'">
              <div class="searchInputDiv">
                <el-input size="small" v-model="field.Value" class="searchInput" @keyup.enter.native="getList" :placeholder="field.Title"></el-input>
              </div>
              <div style="clear:both;"></div>
            </div>
            <div class="searchItem" v-else-if="field.ControlType=='ComboTreeBox'">
              <div class="searchInputDiv">
                <select-tree v-model="field.Value" width="200" size="small" :options="field.BinderList" :targetName="field.TargetName" :change="selectChange"  :placeholder="field.Title"  :props="treeDefaultProps"/>
              </div>
              <div style="clear:both;"></div>
            </div>
            <div class="searchItem" v-else-if="field.ControlType=='ComboRadioBox'">
              <div class="searchInputDiv">
                <el-select size="small" clearable v-model="field.Value"  :placeholder="field.Title" class="searchInput" @change="selectChange(field.Value,field.TargetName)">
                  <el-option v-for="item in field.BinderList":key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                </el-select>
              </div>
              <div style="clear:both;"></div>
            </div>
            <div class="searchItem" v-else-if="field.ControlType=='ComboMultipleBox'">
              <div class="searchInputDiv">
                <el-select size="small" clearable multiple v-model="field.Value"  :placeholder="field.Title" class="searchInput" @change="selectChange(field.Value,field.TargetName)">
                  <el-option v-for="item in field.BinderList":key="item.Id" :label="item.Name" :value="item.Id"></el-option>
                </el-select>          </div>
              <div style="clear:both;"></div>
            </div>
            <div class="searchItem" v-else-if="field.ControlType=='TimeText'">
              <div class="searchInputDiv">
                <el-date-picker size="small" v-model="field.Value" type="datetime" :class="inputCss" style="width:200px;"  :placeholder="field.Title" @change="getList"></el-date-picker>
              </div>
              <div style="clear:both;"></div>
            </div>
          </template>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="this.getList">查询</el-button>
        <el-button type="primary" @click="this.closeWin">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import selectTree from '@/components/common/SelectTree.vue';
    export default {
      name: "SearchAdvanced",
      components: { selectTree },
      data() {
        return {
          // 数据默认字段
          treeDefaultProps: {
            parent: 'ParentId',   // 父级唯一标识
            value: 'Id',          // 唯一标识
            label: 'Name',       // 标签显示
            children: 'ChildList'
          },
          showAdvancedQuery: false
        }
      },
      props: {
        queryParam: {
          type: Object,
          default: () => {
          },
          required: true
        },
        handleGetList: {}
      },
      methods: {
        getList() {
          this.queryParam.IsAdvancedQuery = true;
          this.handleGetList();
          this.showAdvancedQuery = false;
        },
        openWin() {
          this.showAdvancedQuery = true;
        },
        closeWin() {
          this.showAdvancedQuery = false;
        },
        selectChange:function(v,targetName) {
          this.getSelectBinder(v,targetName);
        },
        getSelectBinder:function (parentValue,targetName) {
          if (targetName!=""){
            var whereValue=null;
            for(var i=0,len=this.queryParam.WhereList.length;i<len;i++){
              if (this.queryParam.WhereList[i].ParamName===targetName){
                whereValue = this.queryParam.WhereList[i];
                break;
              }
            }
            if (whereValue!=null){
              var binderList=[];
              whereValue.Value="";
              for (var i=0,len=whereValue.AllBinderList.length;i<len;i++){
                let isAdd = false;
                if (whereValue.RelationId_1) {
                  let v = this.getSourceValue(whereValue.RelationId_1);
                  isAdd = this.isAllowAddBinderValue(whereValue,"RelationId_1",whereValue.AllBinderList[i],v);
                }
                if (whereValue.RelationId_2) {
                  let v = this.getSourceValue(whereValue.RelationId_2);
                  isAdd = isAdd && this.isAllowAddBinderValue(whereValue,"RelationId_2",whereValue.AllBinderList[i],v);
                }
                if (whereValue.RelationId_3) {
                  let v = this.getSourceValue(whereValue.RelationId_3);
                  isAdd = isAdd && this.isAllowAddBinderValue(whereValue,"RelationId_3",whereValue.AllBinderList[i],v);
                }
                if (isAdd){
                  binderList.push(whereValue.AllBinderList[i]);
                }
              }
              whereValue.BinderList = binderList;
              this.getSelectBinder('',whereValue.TargetName);
            }
          }
        },
        getSourceValue:function (paramName) {
          var returnValue = '';
          for(var i=0,len=this.queryParam.WhereList.length;i<len;i++){
            if (this.queryParam.WhereList[i].ParamName===paramName){
              returnValue = this.queryParam.WhereList[i].Value;
              break;
            }
          }
          return returnValue;
        },
        isAllowAddBinderValue:function (whereValue,relationId,binderValue,v) {
          let returnValue = false;
          if (binderValue[relationId]!="" && v!=''){
            if (v instanceof Array) {
              if (v.indexOf(binderValue[relationId])>-1){
                returnValue = true;
              }
            }else{
              if (binderValue[relationId]===v){
                returnValue = true;
              }
            }
          }
          return returnValue;
        }
      },
      computed: {
        dialogWidth: function () {
          let wCount = this.queryParam.WhereList.length;
          if (wCount <= 5) {
            return '400px';
          } else if (wCount <= 10) {
            return '670px';
          } else {
            return '940px';
          }
        }
      }
    }
</script>

<style scoped>

</style>
