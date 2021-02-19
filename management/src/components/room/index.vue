<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="房屋">
          <el-select v-model="queryForm.houseId" clearable placeholder="请选择">
            <el-option
              v-for="item in houseDropDown"
              :key="item.id"
              :label="item.houseName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            clearable
            placeholder="请选择"
            @change="handleRoomStatusChange"
          >
            <el-option
              v-for="item in roomStatusDropDown"
              :key="item.value"
              :label="item.status"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoomList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="toAddRoom()">
        <i class="el-icon-circle-plus"></i>
        添加
      </el-button>
    </div>
    <el-table
      :data="roomList"
      stripe
      style="width: 100%"
      v-loading="loading"
      :header-cell-style="{ background: '#d7e4fb' }"
    >
      <el-table-column type="index" width="50"> </el-table-column>
      <el-table-column prop="roomNumber" label="房号" width="150">
      </el-table-column>
      <el-table-column prop="price" label="租金" width="150"> </el-table-column>
      <el-table-column prop="status" label="状态" width="150"></el-table-column>
      <el-table-column
        prop="updateUserName"
        label="最后更新人"
        width="150"
      ></el-table-column>
      <el-table-column
        prop="updateTime"
        label="最后更新时间"
        width="150"
      ></el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="info"
            icon="el-icon-view"
            size="mini"
            @click="toReferRoom(scope.$index, scope.row.id)"
          >
            查看</el-button
          >
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="toUpdateRoom(scope.$index, scope.row.id)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteRoom()"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getRoomList()">
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
      roomList: [],
      roomStatusDropDown: [{}],
      queryForm: {
        pageSize: 10,
        pageIndex: 1,
        houseId: null,
        floor: null,
        status: null,
      },
      houseDropDown: [{}],
      total: 0,
      loading: false,
    };
  },
  methods: {
    getRoomList(pageIndex) {
      this.loading = true;
      console.log(pageIndex,this.queryForm.pageIndex);
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex
      console.log(this.queryForm.pageIndex);
      this.request
        .post("/room/getRoomList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.roomList = data.list;
          this.total = data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
          this.loading = false;
        });
    },
    getHouseDropDown() {
      this.request
        .post("/house/getHouseDropDown", {})
        .then((response) => {
          this.houseDropDown = response.data;
          if (this.houseDropDown.length > 0) {
            this.$nextTick(() => {
              this.queryForm.houseId = this.houseDropDown[0].id;
              this.getRoomList();
            });
          }
        })
        .catch((error) => {
          this.houseDropDown = [];
          console.log(error);
        });
    },
    getRoomStatusDropDown() {
      this.request
        .post("/room/getRoomStatusDropDown", {})
        .then((response) => {
          this.roomStatusDropDown = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    toAddRoom() {
      this.$router.push("/addRoom");
    },
    toUpdateRoom(index, id) {
      this.$router.push({ path: "/updateRoom", query: { id: id } });
    },
    toReferRoom(index, id) {
      this.$router.push({ path: "/roomInfo", query: { id: id } });
    },
    handleRoomStatusChange(val) {
      if (val === "") {
        this.queryForm.status = null;
      }
    },
    handleSizeChange(value) {
      this.queryForm.pageSize = value;
      this.getRoomList(1);
    },
    handleCurrentChange(value) {
      this.getRoomList(value);
    },
    deleteRoom() {
      this.$message({
        type: "info",
        message: "功能未开放",
      });
    },
  },
  created() {
    this.getHouseDropDown();
    this.getRoomStatusDropDown();
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