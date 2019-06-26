<template>
  <div v-if="addFormVisible" style="width:400px;">
    <el-dialog title="选择职位" :visible.sync="addFormVisible"  width="400px" :close-on-click-modal="false">
      <div style="height: 300px;overflow: auto;">
        <el-tree
          ref="tree"
          highlight-current
          :data="treeData"
          :props="defaultProps"
          :current-node-key = "currentNodeKey"
          :expand-on-click-node="false"
          :default-expand-all="false"
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
            children: 'ChildList',
          },
          currentNodeKey: "",
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
        openPosition: function (id) {
          this.addFormVisible = true;
          if (id) {
            this.currentNodeKey = id;
          }
          setTimeout(() => {
            this.getPositionList();
          }, 200);
        },
        onClickNode: function (node) {
          let ids = node[this.defaultProps.fullValue].split('$');
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
          }
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
