<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="房屋">
          <el-select v-model="queryForm.houseId" clearable>
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
          <el-button type="primary" @click="getBillList()">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="turnBack()">返回</el-button>
      </div>
    </div>
    <el-table
      :data="billList"
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#d7e4fb' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column
        prop="roomNumber"
        label="房号"
        width="200"
      ></el-table-column>
      <el-table-column
        prop="waterUsage"
        label="用水量"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="electricityUsage"
        label="用电量"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="waterCharge"
        label="水费(预计)"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="electricityCharge"
        label="电费(预计)"
        width="100"
      ></el-table-column>
      <el-table-column prop="rent" label="房租" width="100"></el-table-column>
      <el-table-column
        prop="totalCharge"
        label="费用总计(预算)"
        width="150"
      ></el-table-column>
      <el-table-column prop="time" label="时间" width="100"></el-table-column>
      <el-table-column
        prop="updateUserName"
        label="登记人"
        width="150"
      ></el-table-column>
      <el-table-column prop="updateTime" label="登记时间"></el-table-column>
    </el-table>
    <div style="padding-top: 30px">
      <el-popconfirm
        :title="'账单一经结算，费用不可修改，确定结算吗？'"
        @confirm="submitSettle()"
      >
        <template #reference>
          <el-button type="primary" icon="el-icon-circle-check">结算</el-button>
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryForm: {
        houseId: null,
      },
      houseDropDown: [{}],
      houseSelected: false,
      billList: [],
      selectedBillIdList: [],
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
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
    getBillList() {
      this.request
        .post("/bill/getBillList/unsettled", this.queryForm)
        .then((response) => {
          this.billList = response.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleSelectionChange(selection) {
      let idList = selection.map((item) => item.id);
      this.selectedBillIdList = idList;
    },
    submitSettle() {
      this.request
        .post("/bill/settleBill", { billIdList: this.selectedBillIdList })
        .then((response, message) => {
          this.$notify({
            title: "操作成功",
            message: message,
            type: "success",
          });
          this.turnBack();
        })
        .catch((err) => {
          console.error(err);
          this.$notify({
            title: "操作失败",
            message: err,
            type: "error",
          });
        });
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