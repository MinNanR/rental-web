<template>
  <div class="content">
    <div>
      <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
        >返回</el-button
      >
    </div>
    <el-table
      :data="recordList"
      height="250"
      :header-cell-style="{ background: '#d7e4fb' }"
      strip
    >
      <el-table-column type="index" width="50" label="#"></el-table-column>
      <el-table-column prop="name" label="记录"> </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- <el-button type="info" @click="refer(scope.row.url)">查看</el-button> -->
          <el-button
            type="primary"
            @click="download(scope.row.name, scope.row.url)"
            >下载</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      recordList: [{}],
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    getRecordList() {
      this.request
        .post("/utility/getRecordFile")
        .then((response) => {
          let { data } = response;
          this.recordList = data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    refer(url) {
      axios.get(url).then((response) => console.log(response));
    },
    download(name, url) {
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
  },
  mounted() {
    this.getRecordList();
  },
};
</script>

<style>
.header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding-bottom: 10px;
}
</style>