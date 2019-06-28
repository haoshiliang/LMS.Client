<template>
  <div style="width:400px;" v-if="addFormVisible">
    <el-dialog title="选择职位" :visible.sync="addFormVisible"  width="400px" :close-on-click-modal="false">
      <div style="height: 300px;overflow: auto;">
        <el-tree
          ref="tree"
          highlight-current
          node-key="FullId"
          :data="treeData"
          :props="defaultProps"
          :default-checked-keys="[currentNodeKey]"
          :default-expanded-keys="[currentNodeKey]"
          @node-click="onClickNode">
        </el-tree>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    export default {
      name: "SelectPosition",
      data() {
        return {
          defaultProps: {
            value: 'Id',
            label: 'Name',
            fullValue: 'FullId',
            fullNameValue:'FullIdName',
            children: 'ChildList',
          },
          currentNodeKey: '',
          treeData: [],
          addFormVisible: false,
        }
      },
      props: {
        select: {}
      },
      methods: {
        getPositionList() {
          var _this = this;
          this.$ajax({
            method: "get",
            url: "/api/CorpDepartPosition/TreeList"
          }).then(
            function (resultData) {
              if (resultData.data.status == '1') {
                _this.treeData = resultData.data.data;
              }
            }
          );
        },
        openPosition: function (corpId,deptId,positionId) {
          this.addFormVisible = true;
          if (corpId) {
            this.currentNodeKey = (corpId + '$' + deptId + '$' + positionId);
          }
          if (this.treeData.length == 0) {
            setTimeout(() => {
              this.getPositionList();
            }, 200);
          }
        },
        onClickNode: function (node) {
          if(node[this.defaultProps.fullNameValue]) {
            let ids = node[this.defaultProps.fullNameValue].split('$');
            if (ids && ids.length > 0) {
              let corpId = ids[0].split('^')[0];
              let corpName = ids[0].split('^')[1];
              let deptId = ids[1].split('^')[0];
              let deptName = ids[1].split('^')[1];
              let posId = ids[2].split('^')[0];
              let posName = ids[2].split('^')[1];
              if (this.select) {
                this.select(corpId, corpName, deptId, deptName, posId, posName);
              }
              this.addFormVisible = false;
            }
          }
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
