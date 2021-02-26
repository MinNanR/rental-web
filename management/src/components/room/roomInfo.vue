<template>
  <div>
    <div class="content">
      <div class="header">
        <div style="margin-bottom: 20px; color: #909eff">基本信息</div>
        <div>
          <el-button @click="triggerSettle()">结算账单</el-button>
          <el-button type="primary" @click="toUpdateRoom()">编辑</el-button>
          <el-button @click="turnBack()">返回</el-button>
        </div>
      </div>
      <el-skeleton :loading="infoLoading" animated>
        <template #template>
          <el-row>
            <el-col :span="12">
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </el-col>
                <el-col :span="18"
                  ><el-skeleton-item variant="text" style="margin-right: 16px"
                /></el-col>
              </el-row>
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </el-col>
                <el-col :span="18">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </el-col>
              </el-row>
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </el-col>
                <el-col :span="18">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </el-col>
              </el-row>
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </el-col>
                <el-col :span="18">
                  <el-skeleton-item variant="text" style="margin-right: 16px" />
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
        <template #default>
          <el-row>
            <el-col :span="12">
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <b>房屋:</b>
                </el-col>
                <el-col :span="18">{{ roomInfo.houseName }}</el-col>
              </el-row>
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <b>编号:</b>
                </el-col>
                <el-col :span="18">
                  {{ roomInfo.roomNumber }}
                </el-col>
              </el-row>
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <b>楼层:</b>
                </el-col>
                <el-col :span="18"> {{ roomInfo.floor }}楼 </el-col>
              </el-row>
              <el-row class="cus-row" :gutter="20">
                <el-col :span="3" class="label">
                  <b>每月房租:</b>
                </el-col>
                <el-col :span="18"> {{ roomInfo.price }}元 </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-skeleton>
    </div>
    <div class="content" style="margin-top: 30px" :loading="listLoading">
      <div class="header">
        <div style="color: #909eff">房客信息</div>
        <el-button type="primary" @click="openDialog()">房客迁移</el-button>
      </div>
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
        <el-table-column>
          <template #default="scope">
            <el-popconfirm
              :title="`${scope.row.name}确定要退租吗？`"
              @confirm="surrender(scope.$index, scope.row.id)"
            >
              <template #reference>
                <el-button type="primary" icon="el-icon-remove" size="mini"
                  >退租</el-button
                >
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="选择房客"
      v-model="dialogVisible"
      @closed="onDialogClosed"
    >
      <el-row>
        <el-col :span="12">
          <div style="padding-left: 20px; padding-right: 20px">
            <div style="color: #909eff; margin-bottom: 10px">搜索房客</div>
            <div style="display: flex">
              <el-input v-model="tenantName" placeholder="房客名称"></el-input>
              <el-button @click="getTenantDropDown">搜索</el-button>
            </div>
            <div>
              <el-table
                :data="tenantDropDown"
                height="200px"
                :header-cell-style="{ background: '#d7e4fb' }"
                @select="selectTenant"
                ref="searchTable"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column
                  prop="roomNumber"
                  label="原房号"
                ></el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div style="padding-left: 20px; padding-right: 20px">
            <div style="color: #909eff; margin-bottom: 10px">已选房客</div>
            <div style="line-height: 38px">
              已选房客{{ selectTenantList.length }}个
            </div>
            <div>
              <el-table
                :data="selectTenantList"
                height="200px"
                :header-cell-style="{ background: '#d7e4fb' }"
              >
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column
                  prop="roomNumber"
                  label="原房号"
                ></el-table-column>
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button
                      type="text"
                      size="mini"
                      @click="removeSelectTenant(scope.$index, scope.row.id)"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitTeanantMove()"
            >确 定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      id: 0,
      roomInfo: {
        houseName: "",
        roomNumber: "",
        floor: "",
        price: "",
      },
      infoLoading: true,
      listLoading: true,
      tenantList: [],
      tenantDropDown: [],
      dialogVisible: false,
      tenantName: "",
      selectTenantList: [],
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    toUpdateRoom() {
      this.$router.replace({
        path: "/updateRoom",
        query: { id: this.id },
      });
    },
    getRoomInfo() {
      this.request
        .post("/room/getRoomInfo", { id: this.id })
        .then((response) => {
          this.roomInfo = response.data;
          this.infoLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.infoLoading = false;
        });
    },
    getTenantList() {
      this.listLoading = true;
      this.request
        .post("/tenant/getTenantByRoom", { roomId: this.id })
        .then((response) => {
          this.tenantList = response.data;
          this.listLoading = false;
        })
        .catch((error) => {
          console.log(error);
          this.listLoading = false;
        });
    },
    surrender(index, id) {
      this.request
        .post("/tenant/surrender", { id: id })
        .then((response, message) => {
          this.$notify({
            title: "操作成功",
            message: message,
            type: "success",
          });
          this.getTenantList();
        })
        .catch((error) => {
          console.error(error);
          this.$notify({
            title: "操作失败",
            message: error,
            type: "error",
          });
        });
    },
    openDialog() {
      this.dialogVisible = true;
    },
    getTenantDropDown() {
      this.request
        .post("/tenant/getTenantDropDown", {
          name: this.tenantName,
          roomId: this.id,
        })
        .then((response) => {
          this.tenantDropDown = response.data;
          console.log(this.tenantDropDown);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    selectTenant(selection, row) {
      this.selectTenantList.push(row);
    },
    removeSelectTenant(row, id) {
      let index = this.tenantDropDown.findIndex((item) => item.id === id);
      this.selectTenantList.splice(
        this.selectTenantList.findIndex((e) => e.id === id),
        1
      );
      this.$refs["searchTable"].toggleRowSelection(
        this.tenantDropDown[index],
        false
      );
    },
    submitTeanantMove() {
      let idList = this.selectTenantList.map((item) => item.id);
      this.request
        .post("/tenant/tenantMove", {
          tenantIdList: idList,
          houseId: this.roomInfo.houseId,
          houseName: this.roomInfo.houseName,
          roomId: this.roomInfo.id,
          roomNumber: this.roomInfo.roomNumber,
        })
        .then((response, message) => {
          this.$notify({
            title: "操作成功",
            message: message,
            type: "success",
          });
          this.dialogVisible = false;
          this.getTenantList();
        })
        .catch((error) => {
          console.log(error);
          this.$error({
            title: "操作失败",
            message: error,
            type: "success",
          });
        });
    },
    onDialogClosed() {
      this.tenantDropDown = [];
      this.selectTenantList = [];
    },
    triggerSettle() {
      this.request
        .post("/bill/triggerSetBillUnconfirmed", {id :this.id})
        .then((response, message) => {
          this.$notify({
            title: "操作成功",
            message: message,
            type: "success",
          });
        })
        .catch((error) => {
          console.log(error);
          this.$notify({
            title: "操作失败",
            message: error,
            type: "warning",
          });
        });
    },
  },
  mounted() {
    this.infoLoading = true;
    this.id = this.$route.query.id;
    this.getRoomInfo(this.id);
    this.getTenantList(this.id);
  },
};
</script>

<style>
.label {
  text-align: right;
}

.cus-row {
  line-height: 16px;
  margin-bottom: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  height: 40px;
  padding-bottom: 10px;
}
</style>