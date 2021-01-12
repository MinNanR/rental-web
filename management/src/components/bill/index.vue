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
      houseDropDown: [{}],
      billStatusDropDown: [{}],
      loading: false,
    };
  },
  methods: {
    toSettle(){
      this.$router.push("/settle")
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
      if (val == "") {
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
      this.request
        .post("/bill/getBillList", this.queryForm)
        .then((response) => {
          console.log(response);
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