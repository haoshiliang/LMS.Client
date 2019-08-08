<template>
  <div>
    <el-row>
      <el-col :span="12" style="padding: 6px 3px 6px 6px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>标题名称</span>
          </div>
          <div v-for="o in 8" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="padding: 6px 6px 6px 3px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>标题名称</span>
          </div>
          <div v-for="o in 8" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12" style="padding: 6px 3px 6px 6px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>标题名称</span>
          </div>
          <div v-for="o in 8" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" style="padding: 6px 6px 6px 3px;">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>标题名称</span>
          </div>
          <div v-for="o in 8" :key="o" class="text item">
            {{'列表内容 ' + o }}
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  export default {
    name: 'index',
    data() {
      return {
        showLoading:false,
        isDisabled:false
      }
    },
    mounted() {
    },
    methods: {
    }
  }
</script>
