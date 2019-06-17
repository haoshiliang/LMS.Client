<template>
  <div>
    <el-col :span="24">
      <template v-for="field in this.queryParam.WhereList">
        <div class="searchItem" v-if="field.ControlType=='TextBox' && field.IsDefaultQuery">
          <div class="searchTitle">{{field.Title}}</div>
          <span class="searchFlag">：</span>
          <div class="searchInputDiv">
            <el-input size="small" v-model="field.Value" class="searchInput" @keyup.enter.native="getList"></el-input>
          </div>
          <div style="clear:both;"></div>
        </div>
        <div class="searchItem" v-else-if="field.ControlType=='ComboRadioBox' && field.IsDefaultQuery">
          <div class="searchTitle">{{field.Title}}</div>
          <span class="searchFlag">：</span>
          <div class="searchInputDiv">
            <el-select size="small" v-model="field.Value" placeholder="--全部--" class="searchInput" @change="selectChange(field.Value,field.TargetName)">
              <el-option v-for="item in field.BinderList":key="item.Id" :label="item.Name" :value="item.Id"></el-option>
            </el-select>
          </div>
          <div style="clear:both;"></div>
        </div>
      </template>
      <div class="searchButton">
        <el-button type="primary" size="small" @click="this.getList">查询</el-button>
        <el-button type="primary" size="small" icon="el-icon-more" style="margin: 0" @click="opensAdvanced"></el-button>
      </div>
    </el-col>
    <search-advanced ref="sAdvanced" :query-param="this.queryParam" :handle-get-list="this.handleGetList"/>
  </div>
</template>

<script>
  import searchAdvanced from './SearchAdvanced.vue';
    export default {
      name: "Search",
      components: { searchAdvanced },
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
        getSelectBinder:function (v,targetName) {
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
                if (whereValue.AllBinderList[i].RelationId===v){
                  binderList.push(whereValue.AllBinderList[i]);
                }
              }
              whereValue.BinderList = binderList;
              this.getSelectBinder('',whereValue.TargetName);
            }
          }
        }
      },
      created: function () {
      }
    }
</script>

<style scoped>

</style>
