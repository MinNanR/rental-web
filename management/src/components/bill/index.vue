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
        <el-table-column label="房号" width="150">
          <template #default="scope"
            >{{ scope.row.houseName }}-{{ scope.row.roomNumber }}</template
          >
        </el-table-column>
        <el-table-column label="类型" prop="type" width="100"></el-table-column>
        <el-table-column label="水费" width="100">
          <template #default="scope">
            <div v-if="scope.row.typeCode === 'MONTHLY'">
              {{ scope.row.waterCharge }}元
            </div>
            <div v-if="scope.row.typeCode === 'CHECK_IN'">/</div>
          </template>
        </el-table-column>
        <el-table-column label="电费" width="100">
          <template #default="scope">
            <div v-if="scope.row.typeCode === 'MONTHLY'">
              {{ scope.row.electricityCharge }}元
            </div>
            <div v-if="scope.row.typeCode === 'CHECK_IN'">/</div>
          </template>
        </el-table-column>
        <el-table-column label="押金" width="100">
          <template #default="scope">
            <div v-if="scope.row.typeCode === 'MONTHLY'">/</div>
            <div v-if="scope.row.typeCode === 'CHECK_IN'">
              {{ scope.row.deposit }}元
            </div>
          </template>
        </el-table-column>
        <el-table-column label="门禁卡" width="100">
          <template #default="scope">
            <div v-if="scope.row.typeCode === 'MONTHLY'">/</div>
            <div v-if="scope.row.typeCode === 'CHECK_IN'">
              {{ scope.row.accessCardCharge }}元
            </div>
          </template>
        </el-table-column>
        <el-table-column label="房租" width="100">
          <template #default="scope"> {{ scope.row.rent }} 元 </template>
        </el-table-column>
        <el-table-column label="费用总计" width="150">
          <template #default="scope"> {{ scope.row.totalCharge }} 元 </template>
        </el-table-column>
        <el-table-column label="时间" width="100">
          <template #default="scope">
            {{ scope.row.year }}年{{ scope.row.month }}月
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="primary" @click="referImage(scope.row.receiptUrl)"
              >预览收据</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
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
    <el-dialog title="收据" v-model="receiptDialogVisable" width="50%">
      <el-image
        style="width: 60vw; height: 400px"
        :src="receiptUrl"
        :fit="none"
      ></el-image>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="utilityDialogVisable = false">取 消</el-button>
          <el-button type="primary" @click="submitPrice()">确 定</el-button>
        </span>
      </template> -->
    </el-dialog>
    <!-- 敬请期待 -->
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
      receiptUrl: "",
      receiptDialogVisable: false,
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
      console.log(this.queryForm);
    },
    handleSelectStatus(val) {
      this.queryForm.status = val === "" ? null : val;
    },
    handleRoomNumberChange(val) {
      this.queryForm.roomNumber = val === "" ? null : val;
    },
    getBillList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex || this.queryForm.pageIndex;
      if (this.queryForm.monthValue !== null) {
        this.queryForm.year = this.queryForm.monthValue.getFullYear();
        this.queryForm.month = this.queryForm.monthValue.getMonth() + 1;
      } else {
        this.queryForm.year = null;
        this.queryForm.month = null;
      }
      this.request
        .post("/bill/getBills", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.billList = data.list;
          this.total = data.totalCount;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    referImage(url) {
      // this.receiptUrl = url;
      // this.receiptDialogVisable = true;
      this.$router.push({ path: "/receipt", query: { src: url } });
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.getBillList(1);
    },
    handleCurrentChange(val) {
      console.log(val);
      this.getBillList(val);
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