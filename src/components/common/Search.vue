<template>
  <div v-if="isShow">
    <el-col :span="24">
      <template v-for="field in this.queryParam.WhereList">
        <div class="searchItem" v-if="field.ControlType=='TextBox' && field.IsDefaultQuery">
          <div class="searchTitle">{{field.Title}}</div>
          <span class="searchFlag">：</span>
          <div class="searchInputDiv">
            <el-input size="small" v-model="field.Value" :class="inputCss" @keyup.enter.native="getList"></el-input>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div class="searchItem" v-else-if="field.ControlType=='ComboTreeBox' && field.IsDefaultQuery">
          <div class="searchTitle">{{field.Title}}</div>
          <span class="searchFlag">：</span>
          <div class="searchInputDiv">
            <select-tree v-model="field.Value" :width="inputWidth" size="small" :options="field.BinderList" :targetName="field.TargetName" :change="selectChange" placeholder="--全部--"  :props="treeDefaultProps"/>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div class="searchItem" v-else-if="field.ControlType=='ComboRadioBox' && field.IsDefaultQuery">
          <div class="searchTitle">{{field.Title}}</div>
          <span class="searchFlag">：</span>
          <div class="searchInputDiv">
            <el-select size="small" clearable v-model="field.Value" placeholder="--全部--" :class="inputCss" @change="selectChange(field.Value,field.TargetName)">
              <el-option v-for="item in field.BinderList":key="item.Id" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div class="searchItem" v-else-if="field.ControlType=='ComboMultipleBox' && field.IsDefaultQuery">
          <div class="searchTitle">{{field.Title}}</div>
          <span class="searchFlag">：</span>
          <div class="searchInputDiv">
            <el-select size="small" clearable multiple v-model="field.Value" placeholder="--全部--" :class="inputCss" @change="selectChange(field.Value,field.TargetName)">
              <el-option v-for="item in field.BinderList":key="item.Id" :label="item.Name" :value="item.Id"></el-option>
            </el-select>          </div>
          <div style="clear:both;"></div>
        </div>
      </template>
      <div class="searchButton">
        <el-button type="primary" size="small" @click="this.getList">查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-more" style="margin: 0" @click="opensAdvanced"  v-if="this.isShowdvanced"></el-button>
      </div>
    </el-col>
    <search-advanced ref="sAdvanced" :query-param="this.queryParam" :handle-get-list="this.handleGetList"/>
  </div>
</template>

<script>
  import searchAdvanced from './SearchAdvanced.vue';
  import selectTree from '@/components/common/SelectTree.vue';
    export default {
      name: "Search",
      components: { searchAdvanced,selectTree },
      data() {
        return {
          // 数据默认字段
          treeDefaultProps: {
            parent: 'ParentId',   // 父级唯一标识
            value: 'Id',          // 唯一标识
            label: 'Name',       // 标签显示
            children: 'ChildList'
          }
        }
      },
      props: {
        queryParam: {
          type: Object,
          default: () => {
          },
          required: true
        },
        handleGetList: {},
        isShowdvanced:{
          type:Boolean,
          default:true
        },
        size:{
          type:String,
          default:''
        }
      },
      methods: {
        getList() {
          this.queryParam.IsAdvancedQuery = false;
          this.handleGetList();
        },
        opensAdvanced(){
          this.$refs.sAdvanced.openWin();
        },
        selectChange:function(v,targetName) {
          this.getSelectBinder(v,targetName);
          this.getList();
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
      computed:{
        inputCss:function () {
          return this.size=='small'?'searchMinInput':'searchInput';
        },
        inputWidth:function () {
          return this.size=='small'?'150':'200';
        },
        isShow:function () {
          for(var i=0,len=this.queryParam.WhereList.length;i<len;i++){
            if (this.queryParam.WhereList[i].ControlType == "TextBox" || this.queryParam.WhereList[i].ControlType == "ComboTreeBox" ||
                 this.queryParam.WhereList[i].ControlType=="ComboRadioBox" || this.queryParam.WhereList[i].ControlType=="ComboMultipleBox"){
              return true;
            }
          }
          return false;
        }
      },
      created: function () {
      }
    }
</script>

<style scoped>
</style>
