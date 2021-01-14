<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="房号">
          <el-select
            v-model="queryForm.houseId"
            @change="handleSelectHouse"
            clearable
          >
            <el-option
              v-for="item in houseDropDown"
              :key="item.id"
              :label="item.houseName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="queryForm.roomNumber"
            :disabled="!houseSelected"
            @change="handleRoomNumberChange"
          ></el-input>
        </el-form-item>
        <el-form-item label="月份">
          <el-date-picker
            v-model="queryForm.monthValue"
            type="month"
            placeholder="选择月"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态">
          <el-select
            v-model="queryForm.status"
            @change="handleSelectStatus"
            clearable
          >
            <el-option
              v-for="(item, index) in billStatusDropDown"
              :key="index"
              :value="item.value"
              :label="item.status"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getBillList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="toSettle()">结算</el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="billList"
        stripe
        style="width: 100%"
        :header-cell-style="{ background: '#d7e4fb' }"
      >
        <el-table-column type="index" width="55"> </el-table-column>
        <el-table-column
          prop="roomNumber"
          label="房号"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="waterUsage"
          label="用水量(度)"
          width="100"
        ></el-table-column>
        <el-table-column
          prop="electricityUsage"
          label="用电量(度)"
          width="100"
        ></el-table-column>
        <el-table-column label="水费" width="100">
          <template #default="scope"> {{ scope.row.waterCharge }} 元 </template>
        </el-table-column>
        <el-table-column label="电费" width="100">
          <template #default="scope">
            {{ scope.row.electricityCharge }} 元
          </template>
        </el-table-column>
        <el-table-column label="房租" width="100">
          <template #default="scope"> {{ scope.row.rent }} 元 </template>
        </el-table-column>
        <el-table-column label="费用总计" width="150">
          <template #default="scope"> {{ scope.row.totalCharge }} 元 </template>
        </el-table-column>
        <el-table-column prop="time" label="时间" width="100"></el-table-column>
        <el-table-column
          prop="updateUserName"
          label="更新人"
          width="150"
        ></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        houseId: null,
        roomNumber: null,
        monthValue: null,
        status: null,
      },
      houseSelected: false,
      houseDropDown: [{}],
      billStatusDropDown: [{}],
      loading: false,
      billList: [],
      total: 0,
    };
  },
  methods: {
    toSettle() {
      this.$router.push("/settle");
    },
    getbillStautsDropDown() {
      this.request
        .post("/bill/getBillStatusDropDown", {})
        .then((response) => {
          this.billStatusDropDown = response.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    getHouseDropDown() {
      this.request
        .post("/house/getHouseDropDown", {})
        .then((response) => {
          this.houseDropDown = response.data;
        })
        .catch((error) => {
          this.houseDropDown = [];
          console.log(error);
        });
    },
    handleSelectHouse(val) {
      if (val === "") {
        this.houseSelected = false;
        this.queryForm.roomNumber = null;
      } else {
        this.houseSelected = true;
      }
    },
    handleSelectStatus(val) {
      this.queryForm.status = val === "" ? null : val;
    },
    handleRoomNumberChange(val) {
      this.queryForm.roomNumber = val === "" ? null : val;
    },
    getBillList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex | this.queryForm.pageIndex;
      if (this.queryForm.monthValue !== null) {
        this.queryForm.year = this.queryForm.monthValue.getFullYear();
        this.queryForm.month = this.queryForm.monthValue.getMonth() + 1;
      } else {
        this.queryForm.year = null;
        this.queryForm.month = null;
      }
      this.request
        .post("/bill/getBillList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.billList = data.list;
          this.total = data.totalCount;
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  mounted() {
    this.getHouseDropDown();
    this.getbillStautsDropDown();
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