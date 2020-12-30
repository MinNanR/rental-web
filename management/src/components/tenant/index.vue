<template>
  <div>
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="queryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="房屋"
          ><el-select
            v-model="queryForm.houseId"
            clearable
            placeholder="请选择"
            @change="handleSelecteHouse"
          >
            <el-option
              v-for="item in houseDropDown"
              :key="item.id"
              :label="item.houseName"
              :value="item.id"
            >
            </el-option> </el-select
        ></el-form-item>
        <el-form-item label="房号">
          <el-input v-model="queryForm.roomNumber" :disabled="!houseSelected"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getRoomList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="toAddRoom()">
        <i class="el-icon-circle-plus"></i>
        添加
      </el-button>
      <el-table :data="tenantList" strip style="width: 100%">
          <el-table-column type="index" width="50" label="#"></el-table-column>
          <el-table-column prop="name" width="100" label="姓名"></el-table-column>
          <el-table-column prop="phone" width="100" label="电话"></el-table-column>
          <el-table-column prop="hometown" width=""></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houseDropDown: [{}],
      queryForm: {
        name: "",
        houseId: "",
        roomNumber: "",
      },
      houseSelected: false,
      tenantList: [{}],
    };
  },
  methods: {
    getHouseDropDown() {
      this.request
        .post("/house/getHouseDropDown", {})
        .then((response) => {
          this.houseDropDown = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleSelecteHouse(val) {
      if (val == "") {
        this.houseSelected = false;
        this.queryForm.roomNumber = "";
      } else {
        this.houseSelected = true;
      }
    },
  },
  mounted() {
    this.getHouseDropDown();
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