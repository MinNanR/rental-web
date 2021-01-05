<template>
  <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
  <div>
      <router-view></router-view>
    </div>
</template>

<script>
// import Layout from "./components/layout/layout.vue";

export default {
  name: 'App',
  components: {
    // Layout
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.refresh-btn {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 24px;
  color: #409eff;
  cursor: pointer;
}

.content {
  background-color: white;
  padding: 10px 10px 10px 10px;
}
</style>
