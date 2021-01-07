<template>
  <div class="content">
    <div class="header" style="margin-bottom: 20px; color: #909eff">
      <div>
        <el-form
          :inline="true"
          :rules="rules"
          ref="baseInfoForm"
          :model="baseInfo"
        >
          <el-form-item label="房屋" prop="houseId">
            <el-select
              v-model="baseInfo.houseId"
              clearable
              placeholder="请选择"
              @change="handleSelectHouse"
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
          <el-form-item label="楼层" prop="floor">
            <el-select v-model="baseInfo.floor" :disabled="!houseSelected">
              <el-option
                v-for="(item, index) in floorDropDown"
                :key="index"
                :value="item"
                :label="item + '楼'"
                :disabled="!houseSelected"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="月份" prop="monthValue">
            <el-date-picker
              type="month"
              v-model="baseInfo.monthValue"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="finishBaseInfo()">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" @click="submit()">保存</el-button>
        <el-button @click="turnBack()">返回</el-button>
      </div>
    </div>
    <div style="padding-top: 30px">
      <el-table
        :data="utilityList"
        :header-cell-style="{ background: '#d7e4fb' }"
      >
        <el-table-column
          label="房号"
          prop="roomNumber"
          width="100px"
        ></el-table-column>
        <el-table-column label="用水量" width="200px">
          <template #default="scope">
            <el-input v-model="scope.row.water"
              ><template #append>度</template></el-input
            >
          </template>
        </el-table-column>
        <el-table-column label="用电量" width="200px">
          <template #default="scope">
            <el-input v-model="scope.row.electricity"
              ><template #append>度</template></el-input
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houseDropDown: [{}],
      floorDropDown: [{}],
      baseInfo: {
        houseId: null,
        floor: null,
        monthValue: null,
      },
      houseSelected: false,
      submitForm: {},
      utilityList: [],
      rules: {
        houseId: [{ required: "true", message: "请选择房屋", trigger: "blur" }],
        floor: [{ required: "true", message: "请选择楼层", trigger: "blur" }],
        monthValue: [
          { required: "true", message: "请选择月份", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    finishBaseInfo() {
      console.log(this.baseInfo);
      this.$refs["baseInfoForm"].validate((valid) => {
        if (valid) {
          let query = {
            houseId: this.baseInfo.houseId,
            floor: this.baseInfo.floor,
            year: this.baseInfo.monthValue.getFullYear(),
            month: this.baseInfo.monthValue.getMonth() + 1,
          };
          this.request
            .post("/utility/getUtilityToBeRecorded", query)
            .then((response) => {
              let data = response.data;
              this.utilityList = [];
              for (let item of data) {
                this.utilityList.push({
                  roomId: item.id,
                  roomNumber: item.roomNumber,
                  water: null,
                  electricity: null,
                });
              }
            });
        }
      });
    },
    submit() {
      console.log(this.utilityList);
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
    getFloorDropDown() {
      this.request
        .post("/room/getFloorDropDown", { houseId: this.baseInfo.houseId })
        .then((response) => {
          this.floorDropDown = response.data;
          console.log(this.floorDropDown);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    handleSelectHouse(val) {
      if (val == "") {
        this.houseSelected = false;
        this.baseInfo.floor = null;
      } else {
        this.houseSelected = true;
        this.getFloorDropDown();
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