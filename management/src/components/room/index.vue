<template>
  <div>
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
          <el-button type="primary" @click="getRoomList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="toAddRoom()">
        <i class="el-icon-circle-plus"></i>
        添加
      </el-button>
    </div>
    <el-table :data="roomList" stripe style="width: 100%">
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
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="toUpdateRoom(scope.$index, scope.row.id)"
          >
          </el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini">
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="display: flex">
      <div class="refresh-btn">
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
      roomList: [{}],
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
    };
  },
  methods: {
    getRoomList() {
      console.log(this.queryForm);
      this.request
        .post("/room/getRoomList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.roomList = data.list;
          this.total = data.totalCount;
        })
        .catch((error) => {
          console.log(error);
          this.error(error);
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
              console.log(this.queryForm.houseId);
              this.getRoomList();
            });
          }
        })
        .catch((error) => {
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
      this.$router.push({ path: "/roomInfo", query: { id: id } });
      console.log(id);
    },
    handleRoomStatusChange(val) {
      if (val === "") {
        this.queryForm.status = null;
      }
    },
    handleSizeChange(value) {
      this.queryForm.pageSize = value;
      this.queryForm.pageIndex = 1;
      this.getRoomList();
    },
    handleCurrentChange(value) {
      this.queryForm.pageIndex = value;
      this.getRoomList();
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

.refresh-btn {
  width: 30px;
  height: 30px;
  line-height: 30px;
  font-size: 26px;
  color: #409eff;
  cursor: pointer;
}
</style>