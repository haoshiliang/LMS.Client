<template>
  <div class="container">
    <el-container style="border: 1px solid #eee">
      <el-aside width="260px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1', '3']">
          <el-submenu index="1">
            <template slot="title"><i class="el-icon-message"></i>导航一</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title"><i class="el-icon-menu"></i>导航二</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="2-1">选项1</el-menu-item>
              <el-menu-item index="2-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="2-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="3">
            <template slot="title"><i class="el-icon-setting"></i>导航三</template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="3-1">选项1</el-menu-item>
              <el-menu-item index="3-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="3-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="3-4">
              <template slot="title">选项4</template>
              <el-menu-item index="3-4-1">选项4-1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>
        <div class="container">
          <el-row class="searchForm">
            <common-search :handle-get-list="this.getList" :query-param="this.queryParam"/>
          </el-row>
          <el-row class="buttonForm">
            <el-col :span="8">
              <el-button type="text" size="medium" v-if="fList.Add" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
              <el-button type="text" size="medium" v-if="fList.Edit" icon="el-icon-edit" @click="handleEdit">修改</el-button>
              <el-button type="text" size="medium" v-if="fList.Del" icon="el-icon-delete" @click="handleDelete">删除</el-button>
            </el-col>
            <el-col :span="16" style="text-align:right;">
              <common-pagination ref="cPagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
            </el-col>
          </el-row>
          <div class="custom-grid-container">
            <template>
              <el-table :data="tableData">
                <el-table-column prop="date" label="日期" width="140">
                </el-table-column>
                <el-table-column prop="name" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址">
                </el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </el-container>
    </el-container>
  </div>
</template>

<script>
    export default {
      name: "ModuleQuery",
      data() {
        const item = {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        };
        return {
          tableData: Array(20).fill(item),
          data: [],
          recondTotal:0,
          queryParam:{
            IsAdvancedQuery:false,
            WhereList:[
              {Title:'科室编码',Field:'DepartCode',Operator:'like',Value:'',DataType:'String',ControlType:'TextBox',BinderList:[],AllBinderList:[],TargetName:'',SourceName:'',IsDefaultQuery:true},
              {Title:'部门名称',Field:'DepartName|PyCode',Operator:'like',Value:'',DataType:'String',ControlType:'TextBox',BinderList:[],AllBinderList:[],TargetName:'',SourceName:'',IsDefaultQuery:true}
            ],
            SortList:[]
          },
          selectedRow:null,
          fList: this.$common.getFList(this.$route.params.mid)
        }
      },
      mounted() {

      }
    }
</script>

<style scoped>

</style>
