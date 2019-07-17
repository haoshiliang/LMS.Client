<template>
  <div class="container">
    <el-container style="border: 1px solid #eee">
      <el-aside width="230px" style="background-color: rgb(238, 241, 246)">
        <el-tree
          :data="data"
          node-key="Id"
          :default-expanded-keys="extendKeys"
          ref="tree"
          highlight-current
          style="background-color: rgb(238, 241, 246)"
          @node-click="handleOnClick"
          :props="defaultProps">
        </el-tree>
      </el-aside>
      <el-container>
        <div class="container" style="width:100%;">
          <el-row class="buttonForm">
            <el-col :span="8">
              <el-button type="text" size="medium" v-if="fList.Add" icon="el-icon-circle-plus-outline">添加</el-button>
              <el-button type="text" size="medium" v-if="fList.Edit" icon="el-icon-edit">修改</el-button>
              <el-button type="text" size="medium" v-if="fList.Del" icon="el-icon-delete">删除</el-button>
            </el-col>
            <el-col :span="16" style="text-align:right;">
              <common-pagination ref="cPagination" :handle-get-list="this.getList" :record-total="this.recondTotal"/>
            </el-col>
          </el-row>
          <div class="custom-grid-container">
            <template>
              <el-table :data="data" :max-height="gridHeight">
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
        return {
          data: [],
          gridHeight: $(".custom-grid-container").height(),
          recondTotal: 0,
          queryParam: {
            IsAdvancedQuery: false,
            WhereList: [
              {
                Title: '模块ID',
                Field: 'ID',
                Operator: '=',
                Value: '',
                DataType: 'String',
                ControlType: '',
                BinderList: [],
                AllBinderList: [],
                TargetName: '',
                SourceName: '',
                IsDefaultQuery: true
              }
            ],
            SortList: []
          },
          extendKeys: [],
          selectedRow: null,
          fList: this.$common.getFList(this.$route.params.mid),
          defaultProps: {
            children: 'ChildList',
            label: 'Name'
          }
        }
      },
      methods: {
        getModuleList: function () {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/Module/EnableTreeList"
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.data = resultData.data.data;
                _this.extendKeys = [];
                _this.data.forEach(m => {
                  m.ChildList.forEach(c => {
                    _this.extendKeys.push(c.Id);
                  })
                });
              }
            }
          );
        },
        getList:function(){

        },
        handleOnClick:function (d,n,obj) {
          this.queryParam.WhereList[0].Value = d.Id;
          this.getList();
        }
      },
      mounted() {
        this.$nextTick(() => {
          var that = this;
          this.gridHeight = $(".custom-grid-container").height();
          // 通过捕获系统的onresize事件触发去改变原有的高度
          window.onresize = function () {
            that.gridHeight = $(".custom-grid-container").height();
          }
        });
        this.getModuleList();
      }
    }
</script>

<style scoped>

</style>
