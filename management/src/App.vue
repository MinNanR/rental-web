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
</style>
