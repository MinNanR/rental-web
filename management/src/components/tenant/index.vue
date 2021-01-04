<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="queryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="籍贯">
          <el-select
            v-model="queryForm.hometownProvince"
            clearable
            placeholder="请选择"
            @change="handleSeleectProvince"
          >
            <el-option
              v-for="(item, index) in provinceList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="queryForm.hometownCity"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="(item, index) in cityList"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="房屋"
          ><el-select
            v-model="queryForm.houseId"
            clearable
            placeholder="请选择"
            @change="handleSelecteHouse"
            ref="houseSelect"
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
          <el-input
            v-model="queryForm.roomNumber"
            :disabled="!houseSelected"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTenantList()">查询</el-button>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="toAddTenant()">
        <i class="el-icon-circle-plus"></i>
        添加
      </el-button>
    </div>
    <div>
      <el-table
        :data="tenantList"
        strip
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{ background: '#d7e4fb' }"
      >
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column prop="name" width="200" label="姓名"></el-table-column>
        <el-table-column
          prop="phone"
          width="200"
          label="电话"
        ></el-table-column>
        <el-table-column
          prop="hometown"
          width="200"
          label="籍贯"
        ></el-table-column>
        <el-table-column
          prop="identificationNumber"
          width="200"
          label="身份证号码"
        ></el-table-column>
        <el-table-column
          prop="updateUserName"
          width="200"
          label="最后更新人"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          width="200"
          label="更新时间"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="toUpdateTenant(scope.$index, scope.row.id)"
            >
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getTenantList()">
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
import provinces from "../../utils/cities.js";

export default {
  data() {
    return {
      houseDropDown: [{}],
      queryForm: {
        name: "",
        houseId: "",
        roomNumber: "",
        hometownProvince: null,
        hometownCity: null,
        pageSize: 10,
        pageIndex: 1,
      },
      houseSelected: false,
      tenantList: [],
      total: null,
      loading: false,
      provinceList: provinces,
      cityList: [{}],
    };
  },
  methods: {
    toAddTenant() {
      this.$router.push("/addTenant");
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
    handleSelecteHouse(val) {
      if (val == "") {
        this.houseSelected = false;
        this.queryForm.roomNumber = "";
      } else {
        this.houseSelected = true;
      }
    },
    getTenantList() {
      this.loading = true;
      this.request
        .post("/tenant/getTenantList", this.queryForm)
        .then((response) => {
          this.tenantList = response.data.list;
          this.total = response.data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.laoding = false;
        });
    },
    toUpdateTenant(index, id) {
      console.log(id);
    },
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.getTenantList();
    },
    handleCurrentChange(val) {
      this.queryForm.pageIndex = val;
      this.getTenantList();
    },
    handleSeleectProvince(val) {
      if (val === "") {
        this.cityList = [{}];
        this.queryForm.hometownCity = null;
        this.queryForm.hometownProvince = null;
      } else {
        let index = this.provinceList.findIndex((item) => item.value === val);
        this.cityList = this.provinceList[index].children;
      }
    },
  },
  mounted() {
    this.getHouseDropDown();
    this.getTenantList();
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

.content {
  background-color: white;
  padding: 10px 10px 10px 10px;
}
</style>