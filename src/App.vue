<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<style>
    @import "../static/css/main.css";
</style>
<script>
  export default {
    name: 'app',
    components: {},
    created: function () {
      this.$router.replace('/index')
    }
  }
</script>
