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
        <el-form-item>
          <el-button type="primary" @click="getUserList()">查询</el-button>
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
              修改
            </el-button>
            <el-popconfirm
              :title="`确定禁用用户${scope.row.username}吗？`"
              @confirm="disbaleUser(scope.$index, scope.row.id)"
              v-if="scope.row.enabled === 1"
            >
              <template #reference>
                <el-button type="danger" icon="el-icon-error" size="mini">
                  禁用
                </el-button>
              </template>
            </el-popconfirm>
            <el-popconfirm
              :title="`确定启用用户${scope.row.username}吗？`"
              @confirm="enableUser(scope.$index, scope.row.id)"
              v-else
            >
              <template #reference>
                <el-button type="info" icon="el-icon-circle-check" size="mini"
                  >启用</el-button
                >
              </template>
            </el-popconfirm>
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
      this.$router.push("/addUser");
    },
    toUpdateUser(index, id) {
      this.$router.push({ path: "/updateUser", query: { id: id } });
    },
    getUserList(pageIndex) {
      this.loading = true;
      this.queryForm.pageIndex = pageIndex | this.queryForm.pageIndex;
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
    handleSizeChange(val) {
      this.queryForm.pageSize = val;
      this.getUserList(1);
    },
    handleCurrentChange(val) {
      this.getUserList(val);
    },
    disbaleUser(index, id) {
      this.request
        .post("/user/disableUser", { id: id })
        .then((response, message) => {
          this.$notify({
            title: "操作成功",
            message: message,
            type: "success",
          });
          this.getUserList(1);
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
    enableUser(index, id) {
      this.request
        .post("/user/enableUser", { id: id })
        .then((response, message) => {
          this.$notify({
            title: "操作成功",
            message: message,
            type: "success",
          });
          this.getUserList(1);
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