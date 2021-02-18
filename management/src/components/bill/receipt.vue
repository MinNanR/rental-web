<template>
  <div class="content">
    <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
      >返回</el-button
    >
    <el-image :src="src"> </el-image>
  </div>
</template>

<script>
export default {
  data() {
    return {
      src: "",
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
  },
  mounted() {
    this.src = this.$route.query.src;
    console.log(this.src);
  },
};
</script>

<style>
</style>