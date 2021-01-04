<template>
  <div class="content">
    <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
      >返回</el-button
    >
    <div style="width: 30%">
      <el-form
        :model="updateRoomForm"
        :rules="rules"
        ref="updateRoomForm"
        label-width="100px"
      >
        <el-form-item label="房屋" prop="houseId">
          <el-select
            v-model="updateRoomForm.houseId"
            clearable
            placeholder="请选择"
            disabled="true"
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
        <el-form-item label="房间编号" prop="roomNumber">
          <el-input
            type="text"
            v-model="updateRoomForm.roomNumber"
            placehoder="请输入房间编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input
            type="text"
            v-model.number="updateRoomForm.floor"
            placeholder="楼层"
            ><template #append>楼</template></el-input
          >
        </el-form-item>
        <el-form-item label="每月房租" prop="price">
          <el-input
            type="text"
            v-model.number="updateRoomForm.price"
            placeholder="每月房租"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('updateRoomForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      updateRoomForm: {},
      roomInfo: {},
      houseDropDown: [{}],
      rules: {
        roomNumber: [
          { required: true, message: "请输入房间编号", trigger: "blur" },
          { validator: this.checkRoomNumberExist, trigger: "blur" },
        ],
        floor: [{ type: "number", message: "请输入数字", trigger: "blur" }],
        price: [{ type: "number", message: "请输入数字", trigger: "blur" }],
      },
    };
  },
  methods: {
    turnBack() {
      this.$router.history.go(-1);
    },
    loadData(id) {
      this.request
        .post("/room/getRoomInfo", { id: id })
        .then((response) => {
          let data = response.data;
          this.roomInfo = {
            houseId: data.houseId,
            roomNumber: data.roomNumber,
            floor: data.floor,
            price: data.price,
            status: data.status,
          };
          this.updateRoomForm = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getHouseDropDown(id) {
      this.request
        .post("/house/getHouseDropDown", {})
        .then((response) => {
          this.houseDropDown = response.data;
          if (this.houseDropDown.length > 0) {
            this.$nextTick(() => {
              this.loadData(id);
            });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    checkRoomNumberExist(rule, value, callback) {
      this.request
        .post("/room/checkRoomNumberUsed", {
          houseId: this.updateRoomForm.houseId,
          roomNumber: value,
          id: this.updateRoomForm.id,
        })
        .then((response) => {
          if (response.data) {
            callback(new Error("房间编号已使用"));
          } else {
            callback();
          }
        });
    },
    submit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let roomInfo = this.roomInfo;
          let updateRoomForm = this.updateRoomForm;
          let submitForm = {};
          if (roomInfo.roomNumber !== updateRoomForm.roomNumber) {
            submitForm.roomNumber = updateRoomForm.roomNumber;
          }
          if (roomInfo.floor !== updateRoomForm.floor) {
            submitForm.floor = updateRoomForm.floor;
          }
          if (roomInfo.price !== updateRoomForm.floor) {
            submitForm.price = updateRoomForm.price;
          }
          if (Object.keys(submitForm).length === 0) {
            this.$notify({
              title: "操作成功",
              message: "没有修改的信息",
              type: "info",
            });
            this.turnBack();
            return;
          }
          submitForm.id = this.updateRoomForm.id;
          this.request
            .post("/room/updateRoom", submitForm)
            .then((response, message) => {
              console.log(response);
              this.$notify({
                title: "操作成功",
                message: message,
                type: "success",
              });
              this.turnBack();
            })
            .catch((error) => {
              this.$notify({
                title: "操作失败",
                message: error,
                type: "error",
              });
            });
        }
      });
    },
  },
  mounted() {
    this.getHouseDropDown(this.$route.query.id);
  },
};
</script>

<style>
.content {
  background-color: white;
  padding: 10px 10px 10px 10px;
}
</style>