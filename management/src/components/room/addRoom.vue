<template>
  <div class="content">
    <el-button :size="'small'" style="margin-bottom: 30px" @click="turnBack()"
      >返回</el-button
    >
    <div style="width: 30%">
      <el-form
        :model="addRoomForm"
        :rules="rules"
        ref="addRoomForm"
        label-width="100px"
      >
        <el-form-item label="房屋" prop="houseId">
          <el-select
            v-model="addRoomForm.houseId"
            clearable
            placeholder="请选择"
            ref="houseSelect"
            @change="selectHouse"
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
            v-model="addRoomForm.roomNumber"
            placehoder="请输入房间编号"
            :disabled="!houseSelected"
            width:
          ></el-input>
        </el-form-item>
        <el-form-item label="楼层" prop="floor">
          <el-input
            type="text"
            v-model.number="addRoomForm.floor"
            placeholder="楼层"
            ><template #append>楼</template></el-input
          >
        </el-form-item>
        <el-form-item label="每月房租" prop="price">
          <el-input
            type="text"
            v-model.number="addRoomForm.price"
            placeholder="每月房租"
            ><template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit('addRoomForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('addRoomForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      houseDropDown: [{}],
      addRoomForm: {
        houseId: "",
        houseName: "",
        roomNumber: "",
        floor: null,
        price: "",
      },
      houseSelected: false,
      rules: {
        houseId: [{ required: true, message: "请选择房屋", trigger: "blur" }],
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
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    selectHouse(val) {
      this.houseSelected = !(val === "");
      let house = this.houseDropDown.find((item) => {
        return item.id === val;
      });
      this.addRoomForm.houseName = house.houseName
    },
    checkRoomNumberExist(rule, value, callback) {
      this.request
        .post("/room/checkRoomNumberUsed", {
          houseId: this.addRoomForm.houseId,
          roomNumber: value,
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
          this.request
            .post("/room/addRoom", this.addRoomForm)
            .then((response, message) => {
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
  },
  mounted() {
    this.getHouseDropDown();
  },
};
</script>

<style>

</style>