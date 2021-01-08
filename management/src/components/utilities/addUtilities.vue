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
          <el-form-item label="月份" prop="monthValue">
            <el-date-picker
              type="month"
              v-model="baseInfo.monthValue"
              @change="handleSelectMonth"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="房屋" prop="floor">
            <el-cascader
              v-model="baseInfo.floor"
              :props="props"
              ref="roomCascader"
              :disabled="!monthSelected"
            ></el-cascader>
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
    <div style="color: red">
      *用水量和用电量都不填则不记录，填一个则另一个计为0
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
            <el-input v-model.number="scope.row.water"
              ><template #append>度</template></el-input
            >
          </template>
        </el-table-column>
        <el-table-column label="用电量" width="200px">
          <template #default="scope">
            <el-input v-model.number="scope.row.electricity"
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
      props: {
        lazy: true,
        lazyLoad: this.loadData,
      },
      baseInfo: {
        houseId: null,
        floor: [],
      },
      monthSelected: false,
      submitForm: {},
      utilityList: [],
      rules: {
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
      this.$refs["baseInfoForm"].validate((valid) => {
        if (valid) {
          let query = {
            houseId: this.baseInfo.floor[0],
            floor: this.baseInfo.floor[1],
            year: this.baseInfo.monthValue.getFullYear(),
            month: this.baseInfo.monthValue.getMonth() + 1,
          };
          this.request
            .post("/bill/getUnrecordedBill", query)
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
      for (let item of this.utilityList) {
        console.log(
          item.water == null ||
            (item.water == "" && item.electricity == null) ||
            item.electricity == ""
        );
      }
      let submitList = this.utilityList.filter(
        (item) =>
          !(
            item.water == null ||
            (item.water == "" && item.electricity == null) ||
            item.electricity == ""
          )
      );
      console.log(submitList);
    },
    loadData(node, resolve) {
      const { level } = node;
      if (level == 0) {
        this.getHouseDropDown().then((dropDown) => {
          resolve(dropDown);
        });
      } else {
        let houseId = node.data.value;
        this.getFloorDropDown(houseId).then((dropDown) => {
          resolve(dropDown);
        });
      }
    },
    getHouseDropDown() {
      return new Promise((resolve) => {
        this.request
          .post("/house/getHouseDropDown", {})
          .then((response) => {
            let houseList = response.data;
            let optionList = [];
            for (let house of houseList) {
              optionList.push({
                value: house.id,
                label: house.houseName,
                leaf: false,
              });
            }
            resolve(optionList);
          })
          .catch((error) => {
            console.log(error);
            resolve([]);
          });
      });
    },
    getFloorDropDown(houseId) {
      return new Promise((resolve) => {
        let queryForm = {
          houseId: houseId,
          year: this.baseInfo.monthValue.getFullYear(),
          month: this.baseInfo.monthValue.getMonth() + 1,
        };
        this.request
          .post("/bill/getFloorDropDown", queryForm)
          .then((response) => {
            let floor = response.data;
            let optionList = [];
            for (let i of floor) {
              optionList.push({
                value: i,
                label: `${i}楼`,
                leaf: true,
              });
            }
            resolve(optionList);
          })
          .catch((err) => {
            console.error(err);
            resolve([]);
          });
      });
    },
    handleSelectHouse(val) {
      if (val == "") {
        this.houseSelected = false;
        this.baseInfo.floor = null;
      } else {
        this.houseSelected = true;
        if (this.monthSelected) {
          this.getFloorDropDown();
        }
      }
    },
    handleSelectMonth() {
      this.monthSelected = true;
    },
  },
  mounted() {
    this.getHouseDropDown();
  },
  watch: {
    "baseInfo.monthValue": function (val) {
      if (val !== null) {
        this.monthSelected = true;
      } else {
        this.monthSelected = false;
        this.baseInfo.floor = [];
      }
    },
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