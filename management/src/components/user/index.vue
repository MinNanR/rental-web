<template>
  <div class="content">
    <div class="header">
      <el-form :inline="true" :model="queryForm" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="queryForm.realName"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="queryForm.phoneNumber"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="toAddUser()">
        <i class="el-icon-circle-plus"></i>
        添加
      </el-button>
    </div>
    <div>
      <el-table
        :data="userList"
        strip
        style="width: 100%"
        v-loading="loading"
        :header-cell-style="{ background: '#d7e4fb' }"
      >
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column
          width="150"
          prop="username"
          label="用户名"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="realName"
          label="真实姓名"
        ></el-table-column>
        <el-table-column
          width="150"
          prop="phone"
          label="联系电话"
        ></el-table-column>
        <el-table-column
          width="100"
          prop="roleName"
          label="角色"
        ></el-table-column>
        <el-table-column
          width="150"
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
              @click="toUpdateUser(scope.$index, scope.row.id)"
            >
            </el-button>
            <el-button type="primary" icon="el-icon-delete" size="mini">
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="display: flex; margin-top: 30px">
      <div class="refresh-btn" @click="getUserList()">
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
export default {
  data() {
    return {
      userList: [],
      queryForm: {
        pageIndex: 1,
        pageSize: 10,
        realName: "",
        phoneNumber: "",
      },
      total: null,
      loading: false,
    };
  },
  methods: {
    toAddUser() {
        this.$router.push('/addUser')
    },
    toUpdateUser(index, id) {
      console.log(id);
    },
    getUserList() {
      this.loading = true;
      this.request
        .post("/user/getUserList", this.queryForm)
        .then((response) => {
          let data = response.data;
          this.userList = data.list;
          this.total = data.totalCount;
          this.loading = false;
        })
        .catch((error) => {
          console.error(error);
          this.loading = false;
        });
    },
  },
  mounted() {
    this.getUserList();
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