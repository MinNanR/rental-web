<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="房号">
          <el-select
            v-model="queryForm.houseId"
            @change="handleSelecteHouse"
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
          <el-select>
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
      <el-button type="primary" @click="toAddUtility()">
        <i class="el-icon-circle-plus"></i>
        添加
      </el-button>
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
          <template #default>
            <el-button type="primary" icon="el-icon-edit" size="mini">
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
      houseSelected: false,
      loading: false,
      utilityStatusDropDown: [{}],
      houseDropDown: [{}],
      total: null,
    };
  },
  methods: {
    toAddUtility() {
      this.$router.push('/addUtilities')
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
        .post("/utility/getUtilityList", this.queryForm)
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
        .post("/utility/getUtilityStatusDropDown", {})
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
    handleSelecteHouse(val) {
      if (val == "") {
        this.houseSelected = false;
        this.queryForm.roomNumber = null;
      } else {
        this.houseSelected = true;
      }
    },
  },
  mounted() {
    this.getUtilityStautsDropDown();
    this.getHouseDropDown();
    this.getUtilityList(1);
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