<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="地址">
          <el-input v-model="queryForm.address" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getHouseList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="toAddHouse()">
        <i class="el-icon-circle-plus"></i>
        添加
      </el-button>
    </div>
    <el-table
      :data="houseList"
      stripe
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="address" label="地址" width="300">
      </el-table-column>
      <el-table-column prop="directorName" label="管理人姓名" width="150">
      </el-table-column>
      <el-table-column
        prop="updateUserName"
        label="最后更新人"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后更新时间"
        width="200"
      ></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="toUpdateHouse(scope.$index, scope.row.id)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteHouse()"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getHouseList()">
        <i class="el-icon-refresh-right"></i>
      </div>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryForm.pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="10"
        :hide-on-single-page="false"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houseList: [],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
        address: null,
      },
      total: 0,
      loading: false,
    };
  },
  methods: {
    getHouseList() {
      this.loading = true;
      this.request
        .post("/house/getHouseList", this.queryForm)
        .then((response) => {
          this.houseList = response.data.list;
          this.total = response.data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.loading = false;
        });
    },
    toAddHouse() {
      this.$router.push("/addHouse");
    },
    toUpdateHouse(index, id) {
      this.$router.push({ path: "/houseInfo", query: { id: id } });
      // console.log(id);
    },
    handleSizeChange(value) {
      this.queryForm.pageSize = value
      this.getHouseList(1);
    },
    handleCurrentChange(value) {
      this.getHouseList(value);
    },
    deleteHouse() {
      this.$message({
        type: "info",
        message: "功能未开放",
      });
    },
  },
  mounted() {
    this.getHouseList();
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