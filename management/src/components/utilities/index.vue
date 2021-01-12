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
              v-for="(item, index) in utilityStatusDropDown"
              :key="index"
              :value="item.value"
              :label="item.status"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUtilityList(1)">查询</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="info" @click="this.utilityDialogVisable = true">
          <i class="el-icon-setting"></i>
          设置水电价格
        </el-button>
        <el-button type="primary" @click="toAddUtility()">
          <i class="el-icon-circle-plus"></i>
          添加
        </el-button>
      </div>
    </div>
    <div>
      <el-table
        :data="utilityList"
        strip
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{ background: '#d7e4fb' }"
      >
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column
          width="150"
          prop="room"
          label="用户名"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="water"
          label="用水量"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="electricity"
          label="用电量"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="status"
          label="状态"
        ></el-table-column>
        <el-table-column
          width="100"
          prop="updateUserName"
          label="最后更新人"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="updateTime"
          label="最后更新时间"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openModifyDialog(scope.$index)"
            >
              修改
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; margin-top: 30px">
        <div class="refresh-btn" @click="getUserList(1)">
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
    <el-dialog title="修改水电" v-model="editDialogVisible" width="30%">
      <el-form
        :model="modifyForm"
        label-width="100px"
        :rules="rules"
        ref="modifyForm"
      >
        <el-form-item label="房间号">
          <el-input v-model="modifyForm.roomNumber" disabled></el-input>
        </el-form-item>
        <el-form-item label="用水量" prop="waterUsage">
          <el-input v-model="modifyForm.waterUsage"></el-input>
        </el-form-item>
        <el-form-item label="用电量" prop="electricityUsage">
          <el-input v-model="modifyForm.electricityUsage"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitModify">确 定</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="设置水电价格" v-model="utilityDialogVisable" width="30%">
      <el-form
        :model="utilityForm"
        label-width="100px"
        ref="utilityForm"
        :rules="utilityRules"
      >
        <el-form-item label="用水价格" prop="waterPrice">
          <el-input v-model="utilityForm.waterPrice"></el-input>
        </el-form-item>
        <el-form-item label="用电价格" prop="electricityPrice">
          <el-input v-model="utilityForm.electricityPrice"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="utilityDialogVisable = false">取 消</el-button>
          <el-button type="primary" @click="submitPrice()">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      utilityList: [],
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        houseId: null,
        roomNumber: null,
        monthValue: null,
        status: null,
      },
      modifyForm: {},
      modifyIndex: -1,
      houseSelected: false,
      loading: false,
      utilityStatusDropDown: [{}],
      houseDropDown: [{}],
      total: 0,
      editDialogVisible: false,
      utilityDialogVisable: false,
      rules: {
        waterUsage: [
          { required: "true", message: "请填写用水量", trigger: "blur" },
        ],
        electricityUsage: [
          { required: "true", message: "请填写用电量", trigger: "blur" },
        ],
      },
      utilityRules: {
        waterPrice: [
          { required: "true", message: "请填写用水价格", trigger: "blur" },
        ],
        electricityPrice: [
          { required: "true", message: "请填写用用电价格", trigger: "blur" },
        ],
      },
      utilityForm: {},
    };
  },
  methods: {
    toAddUtility() {
      this.$router.push("/addUtilities");
    },
    getUtilityList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex | this.queryForm.pageIndex;
      console.log(this.queryForm);
      if (this.queryForm.monthValue !== null) {
        this.queryForm.month = this.queryForm.monthValue.getMonth() + 1;
        this.queryForm.year = this.queryForm.monthValue.getFullYear();
      }
      this.request
        .post("/bill/getUtilityList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.utilityList = data.list;
          this.total = data.totalCount;
          this.loading = false;
        })
        .catch((err) => {
          console.error(err);
          this.loading = false;
        });
    },
    getUtilityStautsDropDown() {
      this.request
        .post("/bill/getUtilityStatusDropDown", {})
        .then((response) => {
          this.utilityStatusDropDown = response.data;
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
    openModifyDialog(index) {
      this.modifyIndex = index;
      let utlity = this.utilityList[index];
      this.modifyForm = {
        id: utlity.id,
        roomNumber: utlity.room,
        waterUsage: utlity.water,
        electricityUsage: utlity.electricity,
      };
      this.editDialogVisible = true;
    },
    submitModify() {
      console.log(this.modifyForm);
      this.$refs["modifyForm"].validate((valid) => {
        if (valid) {
          let submitForm = {};
          if (
            this.modifyForm.waterUsage !==
            this.utilityList[this.modifyIndex].water
          ) {
            submitForm.waterUsage = this.modifyForm.waterUsage;
          }
          if (
            this.modifyForm.electricityUsage !==
            this.utilityList[this.modifyIndex].electricity
          ) {
            submitForm.electricityUsage = this.modifyForm.electricityUsage;
          }
          if (Object.keys(submitForm).length === 9) {
            this.$notify({
              title: "操作成功",
              message: "没有修改的信息",
              type: "info",
            });
            this.dialogVisible = false;
            return;
          }
          submitForm.id = this.modifyForm.id;
          this.request
            .post("/bill/updateUtility", submitForm)
            .then((response, message) => {
              this.$notify({
                title: "操作成功",
                message: message,
                type: "success",
              });
              (this.dialogVisible = false), this.getUtilityList(1);
            })
            .catch((err) => {
              console.error(err);
              this.$notify({
                title: "操作失败",
                message: err,
                type: "error",
              });
            });
        }
      });
    },
    getUtilityPrice() {
      this.request
        .post("/bill/getUtilityPrice", {})
        .then((response) => {
          this.utilityForm = response.data;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    submitPrice() {
      this.$refs["utilityForm"].validate((valid) => {
        if (valid) {
          this.request
            .post("/bill/setUtilityPrice", this.utilityForm)
            .then((response, message) => {
              this.$notify({
                title: "操作成功",
                message: message,
                type: "success",
              });
              this.utilityDialogVisable = false
            })
            .catch((err) => {
              console.error(err);
              this.$notify({
                title: "操作失败",
                message: err,
                type: "error",
              });
            });
        }
      });
    },
  },
  mounted() {
    this.getUtilityStautsDropDown();
    this.getHouseDropDown();
    this.getUtilityList(1);
    this.getUtilityPrice();
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